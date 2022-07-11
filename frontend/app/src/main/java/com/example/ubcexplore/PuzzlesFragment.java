package com.example.ubcexplore;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

public class PuzzlesFragment extends Fragment {
    ListView listViewPuzzlesVisited;
    ListView listViewPuzzlesCollected;

    public PuzzlesFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_puzzles, container, false);
        listViewPuzzlesVisited = view.findViewById(R.id.list_view_visited);
        listViewPuzzlesCollected = view.findViewById(R.id.list_view_collected);
        //hard coded
        PuzzleButton button1= new PuzzleButton("location1",1);
        PuzzleButton button2= new PuzzleButton("location2",2);
        PuzzleButton button3= new PuzzleButton("location3",3);
        PuzzleButton[] pressedButtons={button1,button2,button3};
        ArrayAdapter<PuzzleButton> listviewAdapterVisited = new ArrayAdapter<PuzzleButton>
                (getContext(), android.R.layout.simple_list_item_1, pressedButtons);
        listViewPuzzlesVisited.setAdapter(listviewAdapterVisited);

        //hard coded for puzzle piece
        PuzzlePiece piece1= new PuzzlePiece("puzzleP1",1);
        PuzzlePiece piece2= new PuzzlePiece("puzzleP2",2);
        PuzzlePiece piece3= new PuzzlePiece("puzzleP3",3);

        PuzzlePiece[] pieces={piece1,piece2,piece3};
        ArrayAdapter<PuzzlePiece> listviewAdapterCollected = new ArrayAdapter<PuzzlePiece>
                (getContext(), android.R.layout.simple_list_item_1, pieces);
        listViewPuzzlesCollected.setAdapter(listviewAdapterCollected);

        return view;
    }
}