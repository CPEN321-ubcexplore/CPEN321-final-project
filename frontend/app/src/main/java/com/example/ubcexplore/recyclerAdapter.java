package com.example.ubcexplore;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

// Followed tutorial from https://www.youtube.com/watch?v=__OMnFR-wZU&t=611s on how to setup RecyclerView
// and https://www.youtube.com/watch?v=vBxNDtyE_Co on how to setup onClickListener on RecyclerView
public class recyclerAdapter extends RecyclerView.Adapter<recyclerAdapter.MyViewHolder> {
    private ArrayList<User> usersList;
    private RecyclerViewClickListener listener;

    public recyclerAdapter(ArrayList<User> usersList, RecyclerViewClickListener listener) {
        this.usersList = usersList;
        this.listener = listener;
    }

    public class MyViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{
        private TextView nameTxt;

        public MyViewHolder(final View view) {
            super(view);
            nameTxt = view.findViewById(R.id.display_name);
            view.setOnClickListener(this);
        }

        @Override
        public void onClick(View view) {
            listener.onClick(view, getAdapterPosition());
        }
    }

    @NonNull
    @Override
    public recyclerAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.list_items, parent, false);
        return new MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(@NonNull recyclerAdapter.MyViewHolder holder, int position) {
        String name = usersList.get(position).getUsername();
        holder.nameTxt.setText(name);
    }

    @Override
    public int getItemCount() {
        return usersList.size();
    }

    public interface RecyclerViewClickListener{
        void onClick(View v, int position);
    }
}
