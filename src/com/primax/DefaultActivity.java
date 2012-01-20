package com.primax;

import android.os.Bundle;
import com.phonegap.*;

public class DefaultActivity extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("splashscreen", R.drawable.splash); // Displays the splash screen for android
        super.loadUrl("file:///android_asset/www/index.html"); // Second parameter is duration for delay of splash screen
    }
}

