package com.csusm.twinder.Fragment;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.csusm.twinder.R;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link PageFragment} interface
 * to handle interaction events.
 * Use the {@link PageFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
// In this case, the fragment displays simple text based on the page
public class PageFragment extends Fragment {
    public static final String ARG_PAGE = "ARG_PAGE";

    private int mPage;

    public static Fragment newInstance(int page) {
        Bundle args = new Bundle();
        args.putInt(ARG_PAGE, page);

        Log.d("PAGEFRAGMENT_ARG_PAGE", String.valueOf(page));

        if (page == 1) {

            args.putString("FRAG_TYPE", "FUTURE_EVENT_FRAG");
            EventListFragment eventPassedFrag = new EventListFragment();
            eventPassedFrag.setArguments(args);
            return eventPassedFrag;
        }
        else if (page == 2) {

            args.putString("FRAG_TYPE", "PASSED_EVENT_FRAG");
            EventListFragment eventPassedFrag = new EventListFragment();
            eventPassedFrag.setArguments(args);
            return eventPassedFrag;
        }

        else {
            args.putInt(ARG_PAGE, page);

            PageFragment pageFragment = new PageFragment();
            pageFragment.setArguments(args);
            return pageFragment;
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mPage = getArguments().getInt(ARG_PAGE);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_page, container, false);
        return view;
    }
}
