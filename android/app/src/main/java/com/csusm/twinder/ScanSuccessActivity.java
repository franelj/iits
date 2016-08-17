package com.csusm.twinder;

import android.media.Image;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;

import com.koushikdutta.ion.Ion;

import java.util.Random;

public class ScanSuccessActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scan_success);

        String barCode              = getIntent().getStringExtra("BARCODE");

        ImageView scanEventImage    = (ImageView)findViewById(R.id.scanEventImage);
        TextView description        = (TextView)findViewById(R.id.description);
        TextView eventName          = (TextView)findViewById(R.id.eventName);
        TextView eventDate          = (TextView)findViewById(R.id.dateValue);
        TextView eventLoc           = (TextView)findViewById(R.id.locationValue);



        Random r = new Random();
        int i1 = r.nextInt(10);

        Ion.with(scanEventImage).load("http://lorempixel.com/640/360/nightlife/" + String.valueOf(i1));
        eventName.setText("RANDOM EVENT" + " (" + barCode + ")") ;
        description.setText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer rutrum eu augue at sodales. Aenean tristique molestie molestie. Cras rutrum leo ac justo convallis mollis. Suspendisse tincidunt ultricies elementum. Duis sagittis lorem non tellus luctus, sit amet imperdiet nunc dignissim. Pellentesque quis nunc iaculis, efficitur nibh at, aliquet dolor. Donec porta a erat at consectetur. Nulla quis consectetur mi. Suspendisse lacus magna, dictum ut mollis ut, tempor vel dui. Sed vitae magna dolor. Phasellus elementum luctus diam.");
        eventDate.setText("UNKNOWN DATE");
        eventLoc.setText("CSUSM - Academic Hall");
    }
}
