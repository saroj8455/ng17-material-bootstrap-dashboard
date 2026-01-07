package com.thedevsaroj.com;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import androidx.core.splashscreen.SplashScreen;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Handle the splash screen transition.
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
    }
}
