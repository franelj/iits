package com.csusm.twinder;

import android.content.Intent;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;

import com.google.gson.JsonObject;
import com.koushikdutta.async.future.FutureCallback;
import com.koushikdutta.ion.Ion;

public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        final EditText username = (EditText) findViewById(R.id.username);
        final EditText password = (EditText) findViewById(R.id.password);

        Button loginButton = (Button) findViewById(R.id.loginButton);

        SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());


        if (!sharedPreferences.getString("username", "").equals("") && !sharedPreferences.getString("password", "").equals(""))
            connectToApi(sharedPreferences.getString("username", ""), sharedPreferences.getString("password", ""), false);


        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("LoginActivity", "loginButtonClicked");
                System.out.println("loginButtonClicked");

                String usernameText = username.getText().toString();
                String passwordText = password.getText().toString();

                connectToApi(usernameText, passwordText, true);

            }
        });

    }

    public void connectToApi(final String username,final String password, final Boolean rememberCheck) {

        final CheckBox rememberBox = (CheckBox) findViewById(R.id.rememberBox);

        Log.d("LoginActivity", "connectToApi");

        Ion.with(getBaseContext())
                    .load(getString(R.string.main_api_url) + "users/authenticate")
                    .setBodyParameter("username", username)
                    .setBodyParameter("password", password)
                    .asJsonObject()
                    .setCallback(new FutureCallback<JsonObject>() {
                        @Override
                        public void onCompleted(Exception e, JsonObject result) {
                            if (e == null) {
                                if (result != null) {
                                    System.out.println(result);

                                    if (result.has("error")) {
                                        AlertDialog dialog = new AlertDialog.Builder(LoginActivity.this)
                                                .setMessage(result.get("error").getAsJsonObject().get("message").getAsString())
                                                .show();
                                    } else if (result.has("jwt")) {
                                        if (rememberCheck) {

                                            if (rememberBox.isChecked()) {
                                                SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());


                                                SharedPreferences.Editor editor = sharedPreferences.edit();
                                                editor.putString("username", username);
                                                editor.putString("password", password);
                                                editor.apply();

                                            }
                                        }

                                        Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                                        intent.putExtra("token", result.get("jwt").getAsString());
                                        startActivity(intent);
                                        finish();
                                    } else {
                                        AlertDialog dialog = new AlertDialog.Builder(LoginActivity.this)
                                                .setMessage(getString(R.string.network_error_api_error))
                                                .show();
                                    }
                                } else {
                                    AlertDialog dialog = new AlertDialog.Builder(LoginActivity.this)
                                            .setMessage(getString(R.string.network_error))
                                            .show();
                                }
                            } else {
                                AlertDialog dialog = new AlertDialog.Builder(LoginActivity.this)
                                        .setMessage(getString(R.string.network_error))
                                        .show();
                            }
                        }
                    });
        }
}
