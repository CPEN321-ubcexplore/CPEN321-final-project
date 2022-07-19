package com.example.ubcexplore;

public class PuzzlePiece {
    String location;
    int id;
    public PuzzlePiece(String location, int id){
        this.location=location;
        this.id=id;
    }
    @Override
    public String toString(){
        return location+"     "+id;
    }
}
