import React, { useState, useEffect } from "react";
import axios from "axios";
import { Item, List } from "../models/Models";
import { useNavigate } from "react-router-dom";
import ModalList from "./Modals/ModalList";

export interface IListPageProps {}

const Items: React.FunctionComponent<IListPageProps> = () => {
  const defaultList: List[] = [];

  const [error, setError]: [string, (error: string) => void] = useState("");
  const navigate = useNavigate();
  const [lists, setLists]: [List[], (lists: List[]) => void] = useState(defaultList);
  let [list, setList] = useState<List>();



  const listSaved = (updatedList: List) => {
    console.log(list);
    let updated = false;
    setList(undefined);
    let newLists = lists.map((list) => {
      if (list.id === updatedList.id) {
        updated = true;
        return updatedList;
      }
      return list;
    });
    if (!updated) {
      newLists = [...newLists, updatedList];
    }

    setLists(newLists);
  };


  useEffect(() => {
    axios
      .get<Item[]>("https://644a97cc79279846dced2be3.mockapi.io/api/v1/list", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setLists(response.data);
      })
      .catch((ex) => {
        const error =
          ex.response.status === 404
            ? "Resource Not found"
            : "An unexpected error has occurred";
        setError(error);
      });
  }, []);

  return (
    <>
      <div className="overflow-x-auto">
      <div className="navbar bg-base-100">
          <div className="navbar-end">
        <label
          htmlFor="my-modal-3"
          className="btn"
          onClick={() => {
            setList({ name: "" });
          }}
        >
          New
        </label>
      </div>
      </div>
        <table className="table w-full">
          <thead>
            <tr>
              <th>NAME</th>
              <th>OPEN</th>
              <th>UPDATE</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((list) => (
              <tr key={list.id}>
                <th>{list.name}</th>
                <th>
                  <label
                    onClick={() => navigate("/list/" + list.id)}
                    className="btn"
                  >
                    Open
                  </label>
                </th>
                <th>
                  <label htmlFor="my-modal-3" id={String(list.id)} className="btn"
                    onClick={() => {
                      setList(list);
                    }}
                  >
                    Update
                  </label>
                </th>
                
              </tr>
            ))}
            {error && <p className="error">{error}</p>}
          </tbody>
        </table>
        {list && (
          <ModalList
            list={list}
            listSaved={listSaved}
            modalClosed={() => setList(undefined)}
          />
        )}
      </div>
    </>
  );
};

export default Items;
