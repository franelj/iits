package com.csusm.twinder.Fragment;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.csusm.twinder.Adapter.EventAdapter;
import com.csusm.twinder.Objects.Event;
import com.csusm.twinder.R;
import com.google.gson.JsonArray;
import com.koushikdutta.async.future.FutureCallback;
import com.koushikdutta.ion.Ion;

import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

import java.util.ArrayList;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link EventListFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link EventListFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class EventListFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    public EventListFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment EventListFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static EventListFragment newInstance(String param1, String param2) {
        EventListFragment fragment = new EventListFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        String token = getArguments().getString("token");

        if (token == null)
            return inflater.inflate(R.layout.fragment_event_list, container, false);

        // Inflate the layout for this fragment
        if (getArguments().getString("FRAG_TYPE") != null) {
            if (getArguments().getString("FRAG_TYPE").equals("PASSED_EVENT_FRAG")) {
                final View view =  inflater.inflate(R.layout.fragment_event_passed, container, false);

                final ArrayList<Event> eventArrayList = new ArrayList<>();

                Ion.with(getContext())
                        .load(getString(R.string.main_api_url) + "events/all?passed=true")
                        .setHeader("authorization", token)
                        .asJsonArray()
                        .setCallback(new FutureCallback<JsonArray>() {
                            @Override
                            public void onCompleted(Exception e, JsonArray result) {

                                if (e == null) {
                                    if (result != null) {
                                        for (int i = 0; i < result.size(); i++) {
                                            Event event = new Event();
                                            event.setName(result.get(i).getAsJsonObject().get("name").getAsString());

                                            DateTimeFormatter parser2 = ISODateTimeFormat.dateTime();
                                            String jtdate = result.get(i).getAsJsonObject().get("date").getAsString();
                                            event.setDate(parser2.parseDateTime(jtdate).getMonthOfYear() + "/" + parser2.parseDateTime(jtdate).getDayOfMonth() + "/" + parser2.parseDateTime(jtdate).getYear() + " (" + parser2.parseDateTime(jtdate).getHourOfDay() + ":" + parser2.parseDateTime(jtdate).getMinuteOfHour() + ")");

                                            eventArrayList.add(event);
                                        }


                                        RecyclerView recyclerView = (RecyclerView) view.findViewById(R.id.recyclerView);


                                        EventAdapter eventAdapter = new EventAdapter(eventArrayList);
                                        recyclerView.setAdapter(eventAdapter);
                                        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
                                    }
                                }
                            }
                        });



                return view;
            } else if (getArguments().getString("FRAG_TYPE").equals("FUTURE_EVENT_FRAG")) {

                final View view =  inflater.inflate(R.layout.fragment_event_future, container, false);
                final ArrayList<Event> eventArrayList = new ArrayList<>();

                Ion.with(getContext())
                        .load(getString(R.string.main_api_url) + "events/all?future=true")
                        .setHeader("authorization", token)
                        .asJsonArray()
                        .setCallback(new FutureCallback<JsonArray>() {
                            @Override
                            public void onCompleted(Exception e, JsonArray result) {
                                if (e == null) {
                                    System.out.println(result);

                                    if (result != null) {
                                        for (int i = 0; i < result.size(); i++) {
                                            Event event = new Event();
                                            event.setName(result.get(i).getAsJsonObject().get("name").getAsString());

                                            DateTimeFormatter parser2 = ISODateTimeFormat.dateTime();
                                            String jtdate = result.get(i).getAsJsonObject().get("date").getAsString();
                                            event.setDate(parser2.parseDateTime(jtdate).getMonthOfYear() + "/" + parser2.parseDateTime(jtdate).getDayOfMonth() + "/" + parser2.parseDateTime(jtdate).getYear() + " (" + parser2.parseDateTime(jtdate).getHourOfDay() + ":" + parser2.parseDateTime(jtdate).getMinuteOfHour() + ")");


                                            eventArrayList.add(event);
                                        }


                                        RecyclerView recyclerView = (RecyclerView) view.findViewById(R.id.recyclerView);


                                        EventAdapter eventAdapter = new EventAdapter(eventArrayList);
                                        recyclerView.setAdapter(eventAdapter);
                                        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
                                    }
                                }
                            }
                        });


                return view;
            }
            else {
                return inflater.inflate(R.layout.fragment_event_list, container, false);
            }
        }
        else
            return inflater.inflate(R.layout.fragment_event_list, container, false);
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p/>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name

        void onFragmentInteraction(Uri uri);
    }
}
