package cn.harmonygarden.piano;

import android.app.Activity;
import android.os.Bundle;
import android.os.Build;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.util.Log;
import java.io.ByteArrayInputStream;
import java.util.Collections;

/** An offline instrument, with no network/storage/microphone permissions or JS native bridge. */
public final class MainActivity extends Activity {
 private WebView piano;
 @Override public void onCreate(Bundle state) {
  super.onCreate(state);
  getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
  piano=new WebView(this);
  piano.getSettings().setJavaScriptEnabled(true);
  piano.getSettings().setAllowFileAccess(false);
  piano.getSettings().setAllowContentAccess(false);
  piano.getSettings().setDomStorageEnabled(true);
  piano.getSettings().setSupportZoom(false);
  piano.getSettings().setTextZoom(100);
  piano.getSettings().setMediaPlaybackRequiresUserGesture(true);
  piano.setOverScrollMode(View.OVER_SCROLL_NEVER);
  piano.setOnLongClickListener(v -> true);
  piano.setLongClickable(false);
  piano.setWebChromeClient(new WebChromeClient(){
   @Override public boolean onConsoleMessage(ConsoleMessage m){Log.d("HarmonyPiano",m.message());return true;}
  });
  piano.setWebViewClient(new WebViewClient(){
   @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){return true;}
   @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
    String name=request.getUrl().getPath();
    if(!"https".equals(request.getUrl().getScheme())||!"piano.local".equals(request.getUrl().getHost())||name==null||name.contains(".."))return blocked();
    if(name.equals("/"))name="/index.html";
    String mime=name.endsWith(".html")?"text/html":name.endsWith(".css")?"text/css":name.endsWith(".js")?"text/javascript":name.endsWith(".png")?"image/png":"application/octet-stream";
    try{return new WebResourceResponse(mime,"UTF-8",200,"OK",Collections.singletonMap("Cache-Control","no-store"),getAssets().open(name.substring(1)));}catch(Exception e){return blocked();}
   }
  });
  setContentView(piano);
  piano.loadUrl("https://piano.local/index.html");
  immersive();
 }
 private static WebResourceResponse blocked(){return new WebResourceResponse("text/plain","UTF-8",404,"Not found",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
 private void immersive(){
  if(Build.VERSION.SDK_INT>=30){WindowInsetsController c=getWindow().getInsetsController();if(c!=null){c.hide(WindowInsets.Type.systemBars());c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);}}
  else getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY|View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_LAYOUT_STABLE|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
 }
 @Override public void onWindowFocusChanged(boolean focused){super.onWindowFocusChanged(focused);if(focused)immersive();else if(piano!=null)piano.evaluateJavascript("window.pianoApp&&window.pianoApp.panic()",null);}
 @Override protected void onPause(){if(piano!=null){piano.evaluateJavascript("window.pianoApp&&window.pianoApp.panic()",null);piano.onPause();}super.onPause();}
 @Override protected void onResume(){super.onResume();if(piano!=null)piano.onResume();immersive();}
 @Override public void onBackPressed(){piano.evaluateJavascript("window.pianoApp ? window.pianoApp.back() : false",value -> {if("false".equals(value))finish();});}
 @Override protected void onDestroy(){if(piano!=null){piano.loadUrl("about:blank");piano.destroy();}super.onDestroy();}
}
