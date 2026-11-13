param([string]$SdkRoot='E:\android-sdk',[string]$OutputDirectory='E:\gitstudyshare\musictheory', [ValidateSet('release','debug')][string]$Configuration='release')
$ErrorActionPreference='Stop'
Set-Location $PSScriptRoot
function Run-Checked([string]$Exe,[string[]]$Arguments){ & $Exe @Arguments; if($LASTEXITCODE -ne 0){throw "$Exe failed with code $LASTEXITCODE"} }
$tools=Join-Path $SdkRoot 'build-tools\36.0.0'
$androidJar=Join-Path $SdkRoot 'platforms\android-35\android.jar'
$javaBin=Split-Path (Get-Command java.exe).Source
$build=Join-Path $PSScriptRoot 'build'
New-Item -ItemType Directory -Force $build,"$build/classes","$build/dex","$PSScriptRoot/.signing",$OutputDirectory | Out-Null
Run-Checked 'node' @("$PSScriptRoot/scripts/sync-assets.cjs")
Run-Checked "$tools/aapt.exe" @('package','-f','-M',"$PSScriptRoot/AndroidManifest.xml",'-S',"$PSScriptRoot/res",'-A',"$PSScriptRoot/assets",'-I',$androidJar,'-F',"$build/base.apk")
Run-Checked "$javaBin/javac.exe" @('--release','8','-encoding','UTF-8','-classpath',$androidJar,'-d',"$build/classes","$PSScriptRoot/src/cn/harmonygarden/piano/MainActivity.java")
Run-Checked "$javaBin/jar.exe" @('cf',"$build/classes.jar",'-C',"$build/classes",'.')
Run-Checked "$tools/d8.bat" @('--lib',$androidJar,'--min-api','26','--output',"$build/dex","$build/classes.jar")
Copy-Item -LiteralPath "$build/base.apk" -Destination "$build/unsigned.apk" -Force
Run-Checked "$javaBin/jar.exe" @('uf',"$build/unsigned.apk",'-C',"$build/dex",'classes.dex')
Run-Checked "$tools/zipalign.exe" @('-f','4',"$build/unsigned.apk","$build/aligned.apk")
$key=Join-Path $PSScriptRoot '.signing\debug.keystore'
if(!(Test-Path -LiteralPath $key)){Run-Checked "$javaBin/keytool.exe" @('-genkeypair','-keystore',$key,'-storepass','android','-keypass','android','-alias','androiddebugkey','-dname','CN=Android Debug,O=Harmony Garden,C=CN','-validity','10000','-keyalg','RSA','-keysize','2048')}
$apk=Join-Path $OutputDirectory ('HarmonyPiano-1.2.0-'+$Configuration+'.apk')
Run-Checked "$tools/apksigner.bat" @('sign','--ks',$key,'--ks-key-alias','androiddebugkey','--ks-pass','pass:android','--key-pass','pass:android','--out',$apk,"$build/aligned.apk")
Run-Checked "$tools/apksigner.bat" @('verify','--verbose',$apk)
Run-Checked "$tools/aapt.exe" @('dump','badging',$apk)
(Get-FileHash -LiteralPath $apk -Algorithm SHA256).Hash | Set-Content -LiteralPath (Join-Path $OutputDirectory ('HarmonyPiano-1.2.0-'+$Configuration+'-SHA256.txt'))
Write-Output "APK: $apk"
