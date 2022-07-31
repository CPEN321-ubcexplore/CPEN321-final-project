package com.example.ubcexplore;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.Espresso.pressBack;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.not;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class EspressoTest {

    @Rule
    public ActivityScenarioRule<MainActivity> activityRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Test
    public void manageProfile() throws InterruptedException {
        // user need to login first to perform this test
        // to login, user need to change the serverClientId at the top of CameraFragment.java
        onView(withId(R.id.login_button)).perform(click());
        Thread.sleep(2000);
        onView(withId(R.id.name)).check(matches(isDisplayed()));
        onView(withId(R.id.score)).check(matches(isDisplayed()));
        onView(withId(R.id.achievements)).check(matches(isDisplayed()));
        onView(withId(R.id.text_achievement)).check(matches(isDisplayed()));
        onView(withId(R.id.items)).check(matches(isDisplayed()));
        onView(withId(R.id.text_item)).check(matches(isDisplayed()));

        onView(withId(R.id.button_edit_name)).perform(click());
        onView(withId(R.id.enter_display_name)).check(matches(isDisplayed()));
        onView(withId(R.id.button_cancel)).check(matches(isDisplayed()));
        onView(withId(R.id.button_confirm)).check(matches(isDisplayed()));

        onView(withId(R.id.button_cancel)).perform(click());
        onView(withId(R.id.enter_display_name)).check(matches(not(isDisplayed())));
        onView(withId(R.id.button_cancel)).check(matches(not(isDisplayed())));
        onView(withId(R.id.button_confirm)).check(matches(not(isDisplayed())));

        onView(withId(R.id.button_edit_name)).perform(click());
        onView(withId(R.id.enter_display_name)).perform(typeText("Test7"));
        pressBack();
        onView(withId(R.id.button_confirm)).perform(click());
        Thread.sleep(3000);
        onView(withId(R.id.name)).check(matches(withText("Test7")));
        onView(withId(R.id.enter_display_name)).check(matches(not(isDisplayed())));
        onView(withId(R.id.button_cancel)).check(matches(not(isDisplayed())));
        onView(withId(R.id.button_confirm)).check(matches(not(isDisplayed())));
    }

    @Test
    public void manageFriends() throws InterruptedException {
        // this is part of the manage profile use case
        // user need to login first to perform this test
        onView(withId(R.id.login_button)).perform(click());
        Thread.sleep(2000);
        onView(withId(R.id.button_friends)).perform(click());
        onView(withId(R.id.friends)).check(matches(isDisplayed()));
        onView(withId(R.id.button_view_requests)).check(matches(isDisplayed()));
        onView(withId(R.id.button_remove_friend)).check(matches(isDisplayed()));
        onView(withId(R.id.button_add_friend)).check(matches(isDisplayed()));
        onView(withId(R.id.text_friend_list)).check(matches(isDisplayed()));

        onView(withId(R.id.button_add_friend)).perform(click());
        onView(withId(R.id.enter_friend_name)).check(matches(isDisplayed()));
        onView(withId(R.id.button_send_request)).check(matches(isDisplayed()));
        onView(withId(R.id.button_cancel_friend)).check(matches(isDisplayed()));

        onView(withId(R.id.button_cancel_friend)).perform(click());
        onView(withId(R.id.enter_friend_name)).check(matches(not(isDisplayed())));
        onView(withId(R.id.button_send_request)).check(matches(not(isDisplayed())));
        onView(withId(R.id.button_cancel_friend)).check(matches(not(isDisplayed())));

        onView(withId(R.id.button_add_friend)).perform(click());
        onView(withId(R.id.enter_friend_name)).perform(typeText("test1"));
        pressBack();
        onView(withId(R.id.button_send_request)).perform(click());
        onView(withId(R.id.button_send_request)).check(matches(not(isDisplayed())));
        onView(withId(R.id.button_cancel_friend)).check(matches(not(isDisplayed())));

        onView(withId(R.id.button_remove_friend)).perform(click());
        onView(withId(R.id.remove_friend_name)).check(matches(isDisplayed()));
        onView(withId(R.id.button_confirm_remove)).check(matches(isDisplayed()));
        onView(withId(R.id.button_cancel_friend)).check(matches(isDisplayed()));

        // if user wants to successfully remove a friend, need to change "test"
        // to the display name of a friend in their friend list
        onView(withId(R.id.remove_friend_name)).perform(typeText("test"));
        pressBack();
        onView(withId(R.id.button_confirm_remove)).perform(click());
        Thread.sleep(2000);
        onView(withId(R.id.remove_friend_name)).check(matches(not(isDisplayed())));
        onView(withId(R.id.button_confirm_remove)).check(matches(not(isDisplayed())));
        onView(withId(R.id.button_cancel_friend)).check(matches(not(isDisplayed())));

        onView(withId(R.id.button_view_requests)).perform(click());
        onView(withId(R.id.button_outgoing_requests)).check(matches(isDisplayed()));
        onView(withId(R.id.button_incoming_requests)).check(matches(isDisplayed()));

        onView(withId(R.id.button_outgoing_requests)).perform(click());
        onView(withId(R.id.text_outgoing_requests)).check(matches(isDisplayed()));

        onView(withId(R.id.button_incoming_requests)).perform(click());
        onView(withId(R.id.recycler_view_incoming_requests)).check(matches(isDisplayed()));
    }

    @Test
    public void displayLocInfo() throws InterruptedException {
        // non-functional requirement
        // this test checks if location info shows up on the camera page within 1 second after
        // user arrives at the location

        // needs to set emulator GPS location manually to a location on the location list
        Thread.sleep(1000);
        onView(withId(R.id.text_location_info)).check(matches(isDisplayed()));
    }
}