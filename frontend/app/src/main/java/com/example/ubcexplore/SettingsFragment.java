package com.example.ubcexplore;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

public class SettingsFragment extends Fragment {
    Button difficultyButton;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view =  inflater.inflate(R.layout.fragment_settings, container, false);

        difficultyButton= view.findViewById(R.id.dIfficulty_button);
        difficultyButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String user_id = ((UserId) requireActivity().getApplication()).getUserId();
                if (user_id == null || user_id.equals("")) {
                    Toast.makeText(getContext(), "Please login to continue!", Toast.LENGTH_SHORT).show();
                } else {
                    Intent intent= new Intent(getActivity(), Difficulty.class);
                    startActivity(intent);
                }
            }
        });

        return view;
    }


}