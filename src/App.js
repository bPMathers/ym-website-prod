import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import HomePageComponent from './Pages/Home/HomePageComponent';
import ContactPageComponent from './Pages/Contact/ContactPageComponent';
import MenuComponent from './Components/Menu/MenuComponent';
import theme from './ui/Theme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import HomePageComponentMobile from './Pages/Home/HomePageComponentMobile';
import MenuComponentMobile from './Components/Menu/MenuComponentMobile';
import ContactPageComponentMobile from './Pages/Contact/ContactPageComponentMobile';
import CCPageMobile from './Pages/CC/CCPageMobile';

export default function App() {
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <div
                    style={{
                        // height: '100vh',
                        // width: '100vw',
                        // position: 'relative',
                        backgroundColor: theme.palette.primary.main,
                    }}
                >
                    {!isMobile && <MenuComponent />}
                    {isMobile && <MenuComponentMobile />}

                    {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                    <Switch>
                        <Route path="/contact">
                            {!isMobile && <ContactPageComponent />}
                            {isMobile && <ContactPageComponentMobile />}
                        </Route>
                        {isMobile && (
                            <Route path="/cc">
                                <CCPageMobile />
                            </Route>
                        )}
                        {/* <Route path="/services">
                            <ServicesPageComponent />
                        </Route>
                        <Route path="/projects">
                            <ProjectsPageComponent />
                        </Route> */}
                        <Route path="/">
                            {!isMobile && <HomePageComponent />}
                            {isMobile && <HomePageComponentMobile />}
                        </Route>
                    </Switch>
                </div>
            </Router>
        </ThemeProvider>
    );
}
