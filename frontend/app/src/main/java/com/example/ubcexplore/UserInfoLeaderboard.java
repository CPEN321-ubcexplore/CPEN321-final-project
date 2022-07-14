package com.example.ubcexplore;

public class UserInfoLeaderboard {
    public String displayName;
    public int score;
    public UserInfoLeaderboard(String name, int score){
        this.displayName=name;
        this.score=score;
    }
    @Override
    public String toString(){
        return displayName+"     "+score;
    }
}
