package com.example.ubcexplore;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.CoreMatchers.not;

import androidx.test.espresso.Espresso;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import org.junit.Rule;
import org.junit.Test;

public class EspressoTestAR {
    @Rule
    public ActivityScenarioRule<MainActivity> activityRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Test
    public void BottomLocationTest() {
        // TODO Set location somewhere
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // Textview is empty if not near a location
        onView(withId(R.id.text_location_info))
                .check(matches(withText("")))
                .check(matches(isDisplayed()));
        // Click on ar view button
        onView(withId(R.id.button_view_ar)).perform(click());
        // An alert pops up
        onView(withId(android.R.id.message))
                .check(matches(withText(R.string.viewARwarning)))
                .check(matches(isDisplayed()));
        // Click on OK
        onView(withId(android.R.id.button3)).perform((click()));
        // Still on main activity
        onView(withId(R.id.bottomNavigationView)).check(matches(isDisplayed()));

        // TODO Move phone near a landmark, textview appears
        // TODO eg. Engineering Cairn
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        onView(withId(R.id.text_location_info))
                .check(matches(not(withText(""))))
                .check(matches(isDisplayed()));
        // Click on ar button
        onView(withId(R.id.button_view_ar)).perform((click()));
        // TODO Move phone around to activate AR
        // ArActivity show
        onView(withId(R.id.arCameraArea)).check(matches(isDisplayed()));
        // go back to test find puzzle
        Espresso.pressBack();
        onView(withId(R.id.puzzles)).perform(click());
        onView(withId(R.id.button_find_puzzles)).perform(click());
        // if ArPuzzle correctly load
        onView(withId(R.id.arPuzzleCameraArea)).check(matches(isDisplayed()));

    }
}
