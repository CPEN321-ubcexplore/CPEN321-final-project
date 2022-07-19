package com.example.ubcexplore;

public class PuzzleButton {
    String location;
    int id;
    public PuzzleButton(String location, int id){
        this.location=location;
        this.id=id;
    }
    @Override
    public String toString(){
        return location+"     "+id;
    }
}
