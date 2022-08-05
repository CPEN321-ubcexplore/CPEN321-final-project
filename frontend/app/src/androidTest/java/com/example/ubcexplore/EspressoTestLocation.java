package com.example.ubcexplore;

import static androidx.test.espresso.Espresso.onData;
import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.anything;
import static org.hamcrest.core.AllOf.allOf;

import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class EspressoTestLocation {

    @Rule
    public ActivityScenarioRule<MainActivity> activityRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Test
    public void BottomLocationTest() {
        // click location bottom icon
        onView(withId(R.id.locations)).perform(click());
        // list of locations shown?
        onView(withId(R.id.list_view_locations)).check(matches(isDisplayed()));
        // click on first location
        onData(anything())
                .inAdapterView(allOf(withId(R.id.list_view_locations)))
                .atPosition(0).perform(click());
        // alertDialog shown?
        onView(withId(android.R.id.message))
                .check(matches(withText(R.string.alertDialog1)))
                .check(matches(isDisplayed()));
        // click on no
        onView(withId(android.R.id.button2)).perform((click()));
        // return to list?
        onView(withId(R.id.list_view_locations)).check(matches(isDisplayed()));
        // click on second location
        onData(anything())
                .inAdapterView(allOf(withId(R.id.list_view_locations)))
                .atPosition(1).perform(click());
        // click on Yes on alertDialog
        onView(withId(android.R.id.button1)).perform((click()));
        // map displayed?
        onView(withId(R.id.map)).check(matches(isDisplayed()));
        // cancel button displayed?
        onView(withId(R.id.button_map_cancel)).check(matches(isDisplayed()));
        // click on button
        onView(withId(R.id.button_map_cancel)).perform(click());
        // return to list?
        onView(withId(R.id.list_view_locations)).check(matches(isDisplayed()));

    }
}