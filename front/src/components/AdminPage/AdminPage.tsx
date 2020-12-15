import React from "react";
import { Admin, Resource } from "react-admin";
import { Provider } from "react-redux";
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
import { store } from "../../index";
import {
  LocationCreate,
  LocationEdit,
  LocationIcon,
  LocationList,
  LocationShow,
} from "./Resources/Location";
import { Helmet } from "react-helmet";
import {
  RoomList,
  RoomEdit,
  RoomCreate,
  RoomShow,
  RoomIcon,
} from "./Resources/Room";

export const history = createBrowserHistory();
const dataProvider = restProvider("http://localhost:5000");
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
    <>
      <Helmet>
        <style type="text/css">
          {`
            #root > header {
              display: none;
            }
          `}
        </style>
      </Helmet>
      <Provider store={adminStore}>
        <Admin
          dataProvider={dataProvider}
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
          <Resource
            name="locations"
            list={LocationList}
            edit={LocationEdit}
            create={LocationCreate}
            show={LocationShow}
            icon={LocationIcon}
          />
          <Resource
            name="rooms"
            list={RoomList}
            edit={RoomEdit}
            create={RoomCreate}
            show={RoomShow}
            icon={RoomIcon}
          />
        </Admin>
      </Provider>
    </>
  );
};

export default AdminPage;
