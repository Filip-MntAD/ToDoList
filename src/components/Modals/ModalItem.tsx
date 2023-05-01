import { useState } from "react";
import axios from "axios";
import { Item } from "../models/Models";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object({
  title: yup.string().required(),
  text: yup.string().required(),
  state: yup.string().required(),
  deadline: yup.string().required(),
});
type Inputs = {
  title: string;
  text: string;
  state: string;
  deadline: Date;
};
export interface IModalProps {}

const ModalItem = ({
  itemSaved,
  modalClosed,
  item,
}: {
  itemSaved: (item: Item) => void;
  modalClosed: () => void;
  item: Item;
}) => {
  const [loading, setLoading]: [boolean, (loading: boolean) => void] =
    useState<boolean>(true);
  const [error, setError]: [string, (error: string) => void] = useState("");
  //const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>({defaultValues:item});
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues: item });
  const { listid } = useParams();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const updatedData = { ...item, ...data };
    updateData(updatedData);
  };

  function updateData(updatedItem) {
    console.log(updatedItem.id);
    axios
      .request({
        url:
          "https://644a97cc79279846dced2be3.mockapi.io/api/v1/list/" +
          listid +
          "/item/" +
          (updatedItem.id ? updatedItem.id : ""),
        method: updatedItem.id ? "put" : "post",
        data: {
          title: updatedItem.title,
          text: updatedItem.text,
          state: updatedItem.state,
          deadline: updatedItem.deadline,
        },
      })
      .then((response) => {
        itemSaved(response.data);
      })
      .catch((ex) => {
        console.error(ex);
        const error =
          ex.response.status === 404
            ? "Resource Not found"
            : "An unexpected error has occurred";
        setError(error);
        setLoading(false);
      });
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box relative">
            <label
              htmlFor="my-modal-3"
              onClick={modalClosed}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>

            <h3 className="text-lg font-bold">
              {item.id ? "UPDATE" : "CREATE NEW"}
            </h3>
            <p className="py-4">{item.id ? "Update item" : "Create item"} </p>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name your todo item.</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                {...register("title")}
                className="input input-bordered w-full"
              />
              <p>{errors.title?.message}</p>

              <label className="label">
                <span className="label-text">Choose a deadline:</span>
              </label>
              <input
                type="datetime-local"
                {...register("deadline")}
                id="deadline"
                name="deadline"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <div className="invalid-feedback">{errors.deadline?.message}</div>

              <label className="label">
                <span className="label-text">Content</span>
              </label>

              <textarea
                className="textarea textarea-bordered h-24"
                {...register("text")}
                placeholder="Bio"
              ></textarea>
              <p>{errors.text?.message}</p>
              <label className="label">
                <span className="label-text">Set status of ToDo item</span>
              </label>
              {item.id && (
                <select
                  {...register("state")}
                  className="select select-bordered"
                >
                  <option value="Active">Active</option>
                  <option value="Finished">Finished</option>
                </select>
              )}
              <p>{errors.state?.message}</p>
            </div>
            <button className="btn btn-success m-3" type="submit">
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ModalItem;
