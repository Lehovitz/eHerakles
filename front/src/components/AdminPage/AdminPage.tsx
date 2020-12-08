import React from "react";
import { Admin, AuthProvider, Resource, ShowGuesser } from "react-admin";
import { Provider, useDispatch } from "react-redux";
import restProvider from "ra-data-simple-rest";
import {
  EventIcon,
  EventList,
  EventCreate,
  EventEdit,
  EventShow,
} from "./Resources/Event";
import { createHashHistory, createBrowserHistory } from "history";
import { createAdminStore } from "react-admin";
import defaultMessages from "ra-language-english";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { updateToken } from "../../redux/bearerToken/actions";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { store } from "../../index";

const history = createBrowserHistory();
const dataProvider = restProvider("http://localhost:5000/");
const i18nProvider = polyglotI18nProvider(() => defaultMessages);

// const LogoutButton = () => {
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     console.log("Logged out from admin panel");
//     dispatch(updateToken(""));
//     window.location.href = window.location.origin;
//   };

//   return <Button onClick={handleLogout}>Logout</Button>;
// };

const authProvider = {
    login: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    checkAuth: () => Promise.resolve(),
    logout: () => {
      store.dispatch(updateToken(""));
      history.push("/");
      return Promise.resolve();
    },
    getIdentity: () =>
      Promise.resolve({ id: 1, fullName: "Admin", avatar: "" }),
    getPermissions: () => Promise.resolve(),
  },
  adminStore = createAdminStore({
    dataProvider,
    history: createHashHistory(),
  });

const AdminPage = () => {
  return (
    <Provider store={adminStore}>
      <Admin
        dataProvider={restProvider("http://localhost:5000")}
        authProvider={authProvider}
        history={history}
        i18nProvider={i18nProvider}
        title="eHerakles Admin"
      >
        <Resource
          name="events"
          list={EventList}
          edit={EventEdit}
          create={EventCreate}
          show={EventShow}
          icon={EventIcon}
        />
        {/* <Resource name="location" list={} edit={} create={} icon={LocationIcon} /> */}
      </Admin>
    </Provider>
  );
};

export default AdminPage;
