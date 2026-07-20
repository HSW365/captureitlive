import { Router, Switch, Route } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProtectedRoute } from "@/components/protected-route";

import Landing from "@/pages/landing";
import Login from "@/pages/login";
import SignUp from "@/pages/signup";
import Onboarding from "@/pages/onboarding";
import Community from "@/pages/community";
import Instructors from "@/pages/instructors";
import InstructorProfile from "@/pages/instructor-profile";
import Classes from "@/pages/classes";
import ClassDetail from "@/pages/class-detail";
import Dashboard from "@/pages/dashboard";
import Messages from "@/pages/messages";
import MessageThread from "@/pages/message-thread";
import ProfileEdit from "@/pages/profile-edit";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <Router hook={useHashLocation}>
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/onboarding">{() => <ProtectedRoute><Onboarding /></ProtectedRoute>}</Route>
            <Route path="/community" component={Community} />
            <Route path="/instructors" component={Instructors} />
            <Route path="/instructors/:id" component={InstructorProfile} />
            <Route path="/classes" component={Classes} />
            <Route path="/classes/:id" component={ClassDetail} />
            <Route path="/dashboard">{() => <ProtectedRoute><Dashboard /></ProtectedRoute>}</Route>
            <Route path="/messages">{() => <ProtectedRoute><Messages /></ProtectedRoute>}</Route>
            <Route path="/messages/:id">{() => <ProtectedRoute><MessageThread /></ProtectedRoute>}</Route>
            <Route path="/profile/edit">{() => <ProtectedRoute><ProfileEdit /></ProtectedRoute>}</Route>
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
