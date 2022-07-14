package com.example.ubcexplore;

import android.app.Application;

public class UserId extends Application {
    private String userId;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
