import React from "react";
import { useMutation } from "@apollo/react-hooks";

import {APP_BAR_COLOR_SETTING_QUERY,UPDATE_APP_BAR_COLOR_SETTING_MUTATION} from "../graphql/query";
import { useQuery } from "@apollo/react-hooks";

function SettingsComponent() {
  const { loading, data } = useQuery(APP_BAR_COLOR_SETTING_QUERY);
  const [updateUserSetting] = useMutation(
    UPDATE_APP_BAR_COLOR_SETTING_MUTATION ,
    {
      update: (cache,mutation) => {
        const data: any = cache.readQuery({
          query: APP_BAR_COLOR_SETTING_QUERY,
        });
        console.log(mutation)
        const dataClone = {
          ...data,
          appBarColorSetting: {
            ...data.appBarColorSetting,
            ...mutation.data.updateAppBarColorSetting
          },
        };

        cache.writeQuery({
          query: APP_BAR_COLOR_SETTING_QUERY,
          data: dataClone,
        });
      },
    }
  );

  if (loading) return <h2>Loading...</h2>;
  return (
    <div style={{ marginTop: "50px" }}>
      <button
        onClick={() =>
          updateUserSetting({ variables: { setting: data.appBarColorSetting.setting === "primary" ? "secondary" : "primary", name: "NOOOB" } })
        }
      >
        Change color
      </button>
    </div>
  );
}

export default SettingsComponent;
