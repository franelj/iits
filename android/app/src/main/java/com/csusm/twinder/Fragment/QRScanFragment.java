/*
 * Copyright (C) Tobrun Van Nuland
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.csusm.twinder.Fragment;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Rect;
import android.hardware.Camera;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.annotation.StringRes;
import android.support.annotation.UiThread;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;

import com.csusm.twinder.MainActivity;
import com.csusm.twinder.R;
import com.csusm.twinder.ScanSuccessActivity;
import com.csusm.twinder.camera.CameraSourcePreview;
import com.csusm.twinder.camera.CameraSource;
import com.google.android.gms.vision.MultiProcessor;
import com.google.android.gms.vision.Tracker;
import com.google.android.gms.vision.barcode.Barcode;
import com.google.android.gms.vision.barcode.BarcodeDetector;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class QRScanFragment extends Fragment implements CameraSourcePreview.OnCameraErrorListener {

    private CameraSource mCameraSource;
    private CameraSourcePreview mPreview;
    private OnScanCompleteListener mCallback;

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        if (activity instanceof OnScanCompleteListener) {
            mCallback = (OnScanCompleteListener) activity;
        } else {
            throw new ClassCastException("Activity hosting the QRScanFragment must implement the OnScanCompleteListener interface");
        }
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_scan, container, false);

        view.setOnTouchListener(new View.OnTouchListener() {
            public boolean onTouch(View v, MotionEvent event) {

                Camera camera = mCameraSource.getCamera();

                if (camera != null) {
                    camera.cancelAutoFocus();
                    Rect focusRect = calculateTapArea((int)event.getX(), (int)event.getY(), 1f);

                    Camera.Parameters parameters = camera.getParameters();
                    parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_AUTO);
                    if (parameters.getMaxNumFocusAreas() > 0) {
                        List<Camera.Area> mylist = new ArrayList<Camera.Area>();
                        mylist.add(new Camera.Area(focusRect, 1000));
                        parameters.setFocusAreas(mylist);
                    }

                    //camera.setParameters(parameters);
                    camera.autoFocus(new Camera.AutoFocusCallback() {
                        @Override
                        public void onAutoFocus(boolean success, Camera camera) {
                            camera.cancelAutoFocus();
                            Camera.Parameters params = camera.getParameters();
                            if(params.getFocusMode() != Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE){
                                params.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE);
                                camera.setParameters(params);
                            }
                        }
                    });
                }

                return true;
            }
        });

        return view;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        mPreview = (CameraSourcePreview) view.findViewById(R.id.preview);
        mPreview.setOnCameraErrorListener(this);
        onCreateDetector(view);
    }

    private void onCreateDetector(@NonNull final View view) {
        final Context context = view.getContext().getApplicationContext();
        final BarcodeDetector barcodeDetector = new BarcodeDetector.Builder(context).build();
        barcodeDetector.setProcessor(new MultiProcessor.Builder<>(new MultiProcessor.Factory<Barcode>() {
            @Override
            public Tracker<Barcode> create(final Barcode barcode) {
                getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        mCallback.onScanComplete(barcode.displayValue);
                        mPreview.stop();

                        Intent intent = new Intent(getContext(), ScanSuccessActivity.class);
                        intent.putExtra("BARCODE", barcode.displayValue);

                        QRScanFragment.this.startActivity(intent);

                    }
                });
                return new Tracker<>();
            }
        }).build());


        if (!barcodeDetector.isOperational()) {
            IntentFilter lowStorageFilter = new IntentFilter(Intent.ACTION_DEVICE_STORAGE_LOW);
            if (context.registerReceiver(null, lowStorageFilter) != null) {
                // Low storage
                mCallback.onCameraError(R.string.camera_error_low_storage);
            } else {
                // Native libs unavailable
                mCallback.onCameraError(R.string.camera_error_dependencies);
            }
            return;
        }

        final ViewTreeObserver observer = view.getViewTreeObserver();
        observer.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN) {
                    view.getViewTreeObserver().removeGlobalOnLayoutListener(this);
                } else {
                    view.getViewTreeObserver().removeOnGlobalLayoutListener(this);
                }

                CameraSource.Builder builder = new CameraSource.Builder(context, barcodeDetector)
                        .setFacing(CameraSource.CAMERA_FACING_BACK)
                        .setRequestedPreviewSize(view.getMeasuredWidth(), view.getMeasuredHeight())
                        .setRequestedFps(30.0f);

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH) {
                    builder = builder.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE);
                }

                mCameraSource = builder.build();
                startCameraSource();
            }
        });
    }

    public void restart() {
        startCameraSource();
    }

    @Override
    public void onResume() {
        super.onResume();
        startCameraSource();
    }

    private void startCameraSource() {
        if (mCameraSource != null) {
            try {
                mPreview.start(mCameraSource);
            } catch (IOException e) {
                mCameraSource.release();
                mCameraSource = null;
            }
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        if (mPreview != null) {
            mPreview.stop();
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (mPreview != null) {
            mPreview.release();
        }
    }

    @Override
    public void onCameraError() {
        if (mCallback != null) {
            mCallback.onCameraError(R.string.camera_error_open);
        }
    }

    public interface OnScanCompleteListener {
        @UiThread
        void onScanComplete(@NonNull final String qrCode);

        @UiThread
        void onCameraError(@StringRes int errorTextRes);
    }

    public Rect calculateTapArea(int x, int y, float f) {

        Rect rect = new Rect(y - 10, x - 10, x + 10, y + 10);

        return rect;
    }


}