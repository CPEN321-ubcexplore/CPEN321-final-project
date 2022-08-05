package com.example.ubcexplore;

public class PuzzlePiece {
    int id;
    String name;

    public PuzzlePiece(int id, String name){
        this.name = name;
        this.id = id;
    }
    @Override
    public String toString(){
        return id + "     " + name;
    }
}
