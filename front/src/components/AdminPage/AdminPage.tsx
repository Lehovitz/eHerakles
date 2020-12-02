import React from "react";
import { Admin, Resource } from "react-admin";
import { Provider, useDispatch } from "react-redux";
import restProvider from "ra-data-simple-rest";
import { EventIcon, EventList, EventCreate, EventEdit } from "./Resources/Event";
import { createHashHistory } from "history";
import { createAdminStore } from "react-admin";
import defaultMessages from "ra-language-english";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { updateToken } from "../../redux/bearerToken/actions";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const history = createHashHistory();
const dataProvider = restProvider("http://localhost:5000/");
const i18nProvider = polyglotI18nProvider(() => defaultMessages);
const store = createAdminStore({
  dataProvider,
  history,
});

const AdminPage = () => {
  return (
    <Provider store={store}>
      <Admin
        dataProvider={restProvider("http://localhost:5000")}
        history={history}
        i18nProvider={i18nProvider}
        title="eHerakles Admin"
      >
        <Resource
          name="events"
          list={EventList}
          edit={EventEdit}
          create={EventCreate}
          icon={EventIcon}
        />
        {/* <Resource name="location" list={} edit={} create={} icon={LocationIcon} /> */}
      </Admin>
    </Provider>
  );
};

export default AdminPage;
