import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Article from "./pages/Article";
import ArticleList from "./pages/ArticleList";
import About from "./pages/About";
import Disclosures from "./pages/Disclosures";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Author from "./pages/Author";
import Search from "./pages/Search";
import Saved from "./pages/Saved";
import Assessments from "./pages/Assessments";
import AssessmentDetail from "./pages/AssessmentDetail";
import Apothecary from "./pages/Apothecary";
import SiteShell from "./components/SiteShell";

function Router() {
  return (
    <SiteShell>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/articles"} component={ArticleList} />
        <Route path={"/articles/:slug"} component={Article} />
        <Route path={"/about"} component={About} />
        <Route path={"/disclosures"} component={Disclosures} />
        <Route path={"/privacy"} component={Privacy} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/author/the-oracle-lover"} component={Author} />
        <Route path={"/search"} component={Search} />
        <Route path={"/saved"} component={Saved} />
        <Route path={"/assessments"} component={Assessments} />
        <Route path={"/assessments/:slug"} component={AssessmentDetail} />
        <Route path={"/apothecary"} component={Apothecary} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </SiteShell>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
