package com.csusm.twinder.Adapter;

import android.content.Intent;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.csusm.twinder.Objects.Event;
import com.csusm.twinder.R;

import java.util.ArrayList;

/**
 * Created by Jonathan on 14/06/15.
 */
public class EventAdapter extends RecyclerView.Adapter<EventAdapter.ViewHolder>{
    private ArrayList<Event> mDataset;


    public EventAdapter(ArrayList<Event> data) {
        mDataset = data;
    }

    // Create new views (invoked by the layout manager)
    @Override
    public EventAdapter.ViewHolder onCreateViewHolder(ViewGroup parent,
                                                   int viewType) {
        // create a new view
        View v;


        v = LayoutInflater.from(parent.getContext()).inflate(R.layout.event_row, parent, false);
        // set the view's size, margins, paddings and layout parameters
        ViewHolder vh = new ViewHolder(v);
        return vh;
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(final ViewHolder holder, final int position) {
        // - get element from your dataset at this position
        // - replace the contents of the view with that element

        holder.title.setText(mDataset.get(position).getName());
        holder.date.setText(mDataset.get(position).getDate());

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
            }
        });
    }





    public void add(int position, Event item) {
        mDataset.add(position, item);
        notifyItemInserted(position);
    }

    public void remove(Event item) {
        int position = mDataset.indexOf(item);
        mDataset.remove(position);
        notifyItemRemoved(position);
    }


    public class ViewHolder extends RecyclerView.ViewHolder {
        public TextView title;
        public TextView date;


        public ViewHolder(View v) {
            super(v);

            title       = (TextView) v.findViewById(R.id.eventName);
            date        = (TextView) v.findViewById(R.id.dateValue);
        }
    }

    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return mDataset.size();
    }


}
