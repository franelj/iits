package com.csusm.twinder;

import android.content.DialogInterface;
import android.net.Uri;
import android.support.annotation.IdRes;
import android.support.annotation.NonNull;
import android.support.annotation.StringRes;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Toast;

import com.csusm.twinder.Fragment.EventFragment;
import com.csusm.twinder.Fragment.EventListFragment;
import com.csusm.twinder.Fragment.ProfilFragment;
import com.csusm.twinder.Fragment.QRScanFragment;
import com.roughike.bottombar.BottomBar;
import com.roughike.bottombar.OnMenuTabClickListener;

public class MainActivity extends AppCompatActivity
        implements ProfilFragment.OnFragmentInteractionListener,
        QRScanFragment.OnScanCompleteListener,
        EventFragment.OnFragmentInteractionListener,
        EventListFragment.OnFragmentInteractionListener {
    private BottomBar mBottomBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final String token = getIntent().getStringExtra("token");

        QRScanFragment frag = new QRScanFragment();
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.main_frame, frag);
        transaction.commit();

        final Bundle bundle = new Bundle();
        bundle.putString("token", token);


        mBottomBar = BottomBar.attach(this, savedInstanceState);
        mBottomBar.setItems(R.menu.bottombar_menu);
        mBottomBar.setOnMenuTabClickListener(new OnMenuTabClickListener() {
            @Override
            public void onMenuTabSelected(@IdRes int menuItemId) {
                if (menuItemId == R.id.bottomBarItemScan) {
                    // The user selected item number one.
                    QRScanFragment frag = new QRScanFragment();
                    FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                    transaction.replace(R.id.main_frame, frag);
                    transaction.commit();
                }
                else if (menuItemId == R.id.bottomBarItemEvent) {
                    // The user selected item number one.
                    System.out.println("new EventFragment");
                    EventFragment frag = new EventFragment();
                    frag.setArguments(bundle);

                    FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                    transaction.replace(R.id.main_frame, frag);
                    transaction.commit();
                }

                else if (menuItemId == R.id.bottomBarItemProfil) {


                    ProfilFragment frag = new ProfilFragment();
                    frag.setArguments(bundle);

                    FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                    transaction.replace(R.id.main_frame, frag);
                    transaction.commit();
                }
            }

            @Override
            public void onMenuTabReSelected(@IdRes int menuItemId) {
                if (menuItemId == R.id.bottomBarItemScan) {
                    // The user reselected item number one, scroll your content to top.
                }
            }
        });

        // Setting colors for different tabs when there's more than three of them.
        // You can set colors for tabs in three different ways as shown below.
        mBottomBar.mapColorForTab(0, ContextCompat.getColor(this, R.color.colorAccent));
        mBottomBar.mapColorForTab(1, 0xFF5D4037);
        mBottomBar.mapColorForTab(2, 0xFF5D4037);
        /*mBottomBar.mapColorForTab(3, "#FF5252");
        mBottomBar.mapColorForTab(4, "#FF9800");*/
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        // Necessary to restore the BottomBar's state, otherwise we would
        // lose the current tab on orientation change.
        mBottomBar.onSaveInstanceState(outState);
    }

    @Override
    public void onFragmentInteraction(Uri uri) {

    }

    @Override
    public void onScanComplete(@NonNull String qrCode) {
        Toast.makeText(this, qrCode, Toast.LENGTH_LONG).show();
    }

    @Override
    public void onCameraError(@StringRes int errorTextRes) {
        new AlertDialog.Builder(this)
                .setTitle(R.string.camera_error)
                .setMessage(errorTextRes)
                .setNeutralButton(R.string.camera_error_dismiss, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        finish();
                    }
                }).show();
    }
}
