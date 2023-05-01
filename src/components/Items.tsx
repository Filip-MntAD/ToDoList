import React, { useState, useEffect } from "react";
import ModalItem from "./Modals/ModalItem";
import axios from "axios";
import { Item, List } from "../models/Models";
import ConfirmModal from "./Modals/ConfirmModal";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";

export interface IItemsPageProps {}

const Items: React.FunctionComponent<IItemsPageProps> = () => {
  const { listid } = useParams();
  const defaultItem: Item[] = [];
  const [items, setItems]: [Item[], (items: Item[]) => void] = useState(defaultItem);
  const [, setLoading]: [boolean, (loading: boolean) => void] = useState<boolean>(true);
  const [error, setError]: [string, (error: string) => void] = useState("");
  let [item, setItem] = useState<Item>();
  let [deleteItem, setDeleteItem] = useState<Number>();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSelectTerm, setSearchSelectTerm] = useState("");
  let [list, setList] = useState<List>();
  const apiUrl = "https://644a97cc79279846dced2be3.mockapi.io/api/v1/list/";



  const itemSaved = (updatedItem: Item) => {
    let updated = false;
    setItem(undefined);
    let newItems = items.map((item) => {
      if (item.id === updatedItem.id) {
        updated = true;
        return updatedItem;
      }
      return item;
    });
    if (!updated) {
      newItems = [...newItems, updatedItem];
    }

    setItems(newItems);
  };



  function deleteRow(id) {
    setDeleteItem(undefined);
    axios
      .delete(apiUrl + listid + `/item/${id}`)
      .then(() => {
        console.log("Delete succesful");
        setItems(items.filter((item) => item.id !== id));
      })
      .catch((ex) => {
        const error =
          ex.response.status === 404
            ? "Resource Not found"
            : "An unexpected error has occurred";
        setError(error);
        setLoading(false);
      });
  }



  function getListName(id) {
    axios
      .get(apiUrl + id)
      .then((response) => {
        setList(response.data);
        console.log("Get name succesful");
      })
      .catch((ex) => {
        const error =
          ex.response.status === 404
            ? "Resource Not found"
            : "An unexpected error has occurred";
        setError(error);
        setLoading(false);
      });
  }



  useEffect(() => {
    axios
      .get<Item[]>(apiUrl + listid + "/item", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((ex) => {
        const error =
          ex.response.status === 404
            ? "Resource Not found"
            : "An unexpected error has occurred";
        setError(error);
        setLoading(false);
      });
    getListName(listid);
  }, []);



  const searcheValues = ["title", "text", "state"];
  const search = (items: Item[]) => {


    if (searchSelectTerm === "All") {
      setSearchSelectTerm("");
    }
    return items.filter(
      (item) =>
        searcheValues.some((value) =>
          item[value].toString().toLowerCase().includes(searchTerm.toLowerCase())
        ) && item.state.includes(searchSelectTerm)
    );
  };


  return (
    <>
            <div className="flex card bg-base-300 rounded-box place-items-center">
          <div className="navbar-start">
            <label
              htmlFor="my-modal-3"
              className="btn"
              onClick={() => {
                setItem({ title: "", text: "", deadline: "", state: "Active" });
              }}
            >
              New
            </label>
          </div>
          <div className="navbar-center">
            <h2 className="normal-case text-xl">{list?.title}</h2>
          </div>
          <div className="navbar-end">
            <input
              placeholder="Search..."
              className="input input-bordered m-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            ></input>
            <select
              onChange={(e) => setSearchSelectTerm(e.target.value)}
              className="select select-bordered m-3"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Finished">Finished</option>
            </select>
          </div>
        </div>
      <div className="overflow-x-auto">

        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Text</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {search(items).map((item) => (
              <tr key={item.id}>
                <th>{item.title}</th>
                <th>{item.text}</th>
                <th>
                  {format(parseISO(item.deadline), "dd/LL/yyyy HH:mm:ss")}
                </th>
                <th>{item.state}</th>
                <th>
                  <label htmlFor="my-modal-3" id={String(item.id)} className="btn"
                    onClick={() => {
                      setItem(item);
                    }}
                  >
                    Update
                  </label>
                </th>
                <th>
                  <label htmlFor="my-modal-delete" className="btn"
                    onClick={() => {
                      setDeleteItem(item.id);
                    }}
                  >
                    Delete
                  </label>
                </th>
              </tr>
            ))}
            {error && <p className="error">{error}</p>}
          </tbody>
        </table>

        {item && (
          <ModalItem
            item={item}
            itemSaved={itemSaved}
            modalClosed={() => setItem(undefined)}
          />
        )}
        {deleteItem && (
          <ConfirmModal
            onConfirm={() => deleteRow(deleteItem)}
            onClose={() => setDeleteItem(undefined)}
            message={"Are you sure you want delete this item ?"}
          />
        )}
      </div>
    </>
  );
};

export default Items;
