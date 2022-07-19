package com.example.ubcexplore;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.android.material.navigation.NavigationBarView;

public class MainActivity extends AppCompatActivity implements NavigationBarView.OnItemSelectedListener {

    NavigationBarView navigationBarView;
    CameraFragment cameraFragment = new CameraFragment();
    LocationFragment locationFragment = new LocationFragment();
    LeaderboardFragment leaderboardFragment = new LeaderboardFragment();
    SettingsFragment settingsFragment = new SettingsFragment();
    PuzzlesFragment puzzlesFragment = new PuzzlesFragment();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                == PackageManager.PERMISSION_DENIED) {
            ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.CAMERA}, 0);
        }

        navigationBarView = findViewById(R.id.bottomNavigationView);

        navigationBarView.setOnItemSelectedListener(this);
        navigationBarView.setSelectedItemId(R.id.camera);

    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {

        switch (item.getItemId()) {
            case R.id.camera:
                getSupportFragmentManager().beginTransaction().replace(R.id.flFragment, cameraFragment).commit();
                return true;

            case R.id.locations:
                getSupportFragmentManager().beginTransaction().replace(R.id.flFragment, locationFragment).commit();
                return true;

            case R.id.leaderboards:
                getSupportFragmentManager().beginTransaction().replace(R.id.flFragment, leaderboardFragment).commit();
                return true;

            case R.id.settings:
                getSupportFragmentManager().beginTransaction().replace(R.id.flFragment, settingsFragment).commit();
                return true;

            case R.id.puzzles:
                getSupportFragmentManager().beginTransaction().replace(R.id.flFragment, puzzlesFragment).commit();
                return true;

            default:
                return false;
        }
    }
}
