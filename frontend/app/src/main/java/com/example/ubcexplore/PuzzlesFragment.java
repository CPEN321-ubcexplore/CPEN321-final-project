package com.example.ubcexplore;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import androidx.fragment.app.Fragment;

public class PuzzlesFragment extends Fragment {
    ListView listViewPuzzles;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_puzzles, container, false);
        listViewPuzzles = view.findViewById(R.id.list_view_collected);

        PuzzlePiece piece1= new PuzzlePiece("puzzleP1",1);
        PuzzlePiece piece2= new PuzzlePiece("puzzleP2",2);
        PuzzlePiece piece3= new PuzzlePiece("puzzleP3",3);

        PuzzlePiece[] pieces={piece1,piece2,piece3};
        ArrayAdapter<PuzzlePiece> listviewAdapterCollected = new ArrayAdapter<PuzzlePiece>
                (getContext(), android.R.layout.simple_list_item_1, pieces);
        listViewPuzzles.setAdapter(listviewAdapterCollected);

        view.findViewById(R.id.button_find_puzzles).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), ArPuzzlesActivity.class);
                startActivity(intent);
            }
        });

        return view;
    }
}