import { useEffect } from "react";
import { Router, Switch, Route, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProtectedRoute, MemberRoute } from "@/components/protected-route";
import { MembershipBar } from "@/components/membership-bar";

import Landing from "@/pages/landing";
import Login from "@/pages/login";
import SignUp from "@/pages/signup";
import Onboarding from "@/pages/onboarding";
import Community from "@/pages/community";
import Instructors from "@/pages/instructors";
import InstructorProfile from "@/pages/instructor-profile";
import Classes from "@/pages/classes";
import Pricing from "@/pages/pricing";
import ClassDetail from "@/pages/class-detail";
import Learn from "@/pages/learn";
import Messages from "@/pages/messages";
import Dashboard from "@/pages/dashboard";
import ProfileEdit from "@/pages/profile-edit";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import NotFound from "@/pages/not-found";
import Academy from "@/pages/academy";
import AcademySport from "@/pages/academy-sport";
import LessonPage from "@/pages/lesson";
import Train from "@/pages/train";
import Start from "@/pages/start";
import Nil from "@/pages/nil";
import NilAthletePage from "@/pages/nil-athlete";
import NilScout from "@/pages/nil-scout";

function Shell() {
  const [loc] = useLocation();
  const arena = loc === "/start" || loc === "/train" || loc.startsWith("/academy") || loc.startsWith("/lesson") || loc.startsWith("/nil");
  const bare = loc === "/start";
  useEffect(() => { document.documentElement.classList.toggle("arena-root", arena); }, [arena]);
  return (
      <div className="min-h-screen flex flex-col">
        {!bare && <Nav />}
        {!bare && <MembershipBar />}
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/signup/instructor" component={SignUp} />
            <Route path="/onboarding">{() => <ProtectedRoute><Onboarding /></ProtectedRoute>}</Route>
            <Route path="/community" component={Community} />
            <Route path="/instructors" component={Instructors} />
            <Route path="/instructors/:id" component={InstructorProfile} />
            <Route path="/i/:id" component={InstructorProfile} />
            <Route path="/classes" component={Classes} />
            <Route path="/classes/:id" component={ClassDetail} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/learn" component={Learn} />
            <Route path="/messages">{() => <MemberRoute><Messages /></MemberRoute>}</Route>
            <Route path="/messages/:id">{() => <MemberRoute><Messages /></MemberRoute>}</Route>
            <Route path="/dashboard">{() => <MemberRoute><Dashboard /></MemberRoute>}</Route>
            <Route path="/profile/edit">{() => <ProtectedRoute><ProfileEdit /></ProtectedRoute>}</Route>
            <Route path="/academy" component={Academy} />
            <Route path="/academy/:sport" component={AcademySport} />
            <Route path="/lesson/:id" component={LessonPage} />
            <Route path="/train" component={Train} />
            <Route path="/nil" component={Nil} />
            <Route path="/nil/athlete" component={NilAthletePage} />
            <Route path="/nil/scout" component={NilScout} />
            <Route path="/start" component={Start} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route component={NotFound} />
          </Switch>
        </main>
        {!bare && <Footer />}
      </div>
  );
}

export default function App() {
  return (
    <Router hook={useHashLocation}>
      <Shell />
    </Router>
  );
}
