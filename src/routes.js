import Home from './components/home/Home';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Reset from './components/reset/Reset';
import ResetNew from './components/reset/ResetNew';
import Friends from './components/friends/Friends';
import Notifications from './components/notifications/Notifications';
import Message from './components/message/Message';
import Discover from './components/discover/Discover';
import Requests from './components/requests/Requests';
import Profile from './components/profile/Profile';
import Post from './components/post/Post';
import NotFound from './components/not-found/NotFound';

export const routes = [
    { path: '/', redirect: '/login' },
    { path: '/home', component: Home },
    { path: '/login', component: Login },
    { path: '/reset', component: Reset },
    { path: '/reset/:token', component: ResetNew },
    { path: '/register', component: Register },
    { path: '/friends', component: Friends },
    { path: '/notifications', component: Notifications },
    { path: '/message', component: Message },
    { path: '/discover', component: Discover },
    { path: '/requests', component: Requests },
    { path: '/not-found', component: NotFound },
    { path: '/post/:id', component: Post },
    { path: '/:username', component: Profile },
    { path: '*', redirect: '/home' }
];