import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import {
  DatabaseQueryEnum,
  PetsDataType,
  setDataType,
} from "../../../../models";

import * as Yup from "yup";
import styles from "./PetForm.module.scss";
import Button from "../../../../components/Button/Button";
import dayjs from "dayjs";
import classNames from "classnames";
import { useEffect, useState } from "react";

type PetFormType = {
  initialValues?: PetsDataType;
  closeEdit?: () => void;
  setData: (data: setDataType) => void;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  birthday: Yup.string().required(),
  breed: Yup.string().required(),
  lastVaccination: Yup.string().required(),
  nextVaccination: Yup.string().required(),
  petType: Yup.string().required(),
  sex: Yup.string().required(),
});

const initialValuesDefault: PetsDataType = {
  name: "",
  birthday: dayjs(new Date()).format("YYYY-MM-DD"),
  breed: "",
  lastVaccination: dayjs(new Date()).format("YYYY-MM-DD"),
  nextVaccination: dayjs(new Date()).format("YYYY-MM-DD"),
  petType: "",
  sex: "Male",
  id: "",
  pillsData: [],
};

const PetForm: React.FC<PetFormType> = ({
  initialValues = initialValuesDefault,
  closeEdit,
  setData,
}) => {
  const [other, setOther] = useState(false);
  useEffect(() => {
    if (initialValues.id) {
      setOther(true);
    }
  }, [initialValues.id]);
  const navigate = useNavigate();
  const handleSubmit = (values: PetsDataType) => {
    setData({
      data: values,
      query: DatabaseQueryEnum.PETS,
      teamId: true,
    });
    close();
  };

  const close = () => {
    if (closeEdit) {
      closeEdit();
    } else {
      navigate("/pets");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ values, errors, handleChange }) => (
        <Form className={classNames(styles.form, "scrollbar")}>
          <h2>New Pet</h2>
          <div
            className={classNames(styles.field, errors.name && styles.error)}
          >
            {errors.name && <span>required</span>}
            <label htmlFor="name">Name</label>
            <Field id="name" name="name" />
          </div>
          <div
            className={classNames(
              styles.field,
              errors.birthday && styles.error
            )}
          >
            {errors.birthday && <span>required</span>}
            <label htmlFor="birthday">Birthday</label>
            <Field
              id="birthday"
              name="birthday"
              type={"date"}
              max={new Date()}
              value={values.birthday}
            />
          </div>
          <div className={classNames(styles.field, errors.sex && styles.error)}>
            <label htmlFor="petType">Sex</label>
            <select onChange={handleChange} value={values.sex} name={"sex"}>
              <option value={"Male"}>Male</option>
              <option value={"Female"}>Female</option>
            </select>
          </div>
          <div
            className={classNames(styles.field, errors.petType && styles.error)}
          >
            {errors.petType && <span>required</span>}
            <label htmlFor="petType">Pet type</label>
            <div className={styles.select}>
              {other ? (
                <Field id="petType" name="petType" />
              ) : (
                <select
                  value={values.petType}
                  onChange={handleChange}
                  name="petType"
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value={values.petType} disabled>
                    {values.petType}
                  </option>
                </select>
              )}

              <div className={styles.other}>
                <label htmlFor="other">Other</label>
                <input
                  type="checkbox"
                  id={"other"}
                  checked={other}
                  onClick={() => setOther(!other)}
                />
              </div>
            </div>
          </div>
          <div
            className={classNames(styles.field, errors.breed && styles.error)}
          >
            {errors.breed && <span>required</span>}
            <label htmlFor="breed">Breed</label>
            <Field id="breed" name="breed" />
          </div>
          <div
            className={classNames(
              styles.field,
              errors.lastVaccination && styles.error
            )}
          >
            {errors.lastVaccination && <span>required</span>}
            <label htmlFor="lastVaccination">Last vaccination</label>
            <Field id="lastVaccination" name="lastVaccination" type={"date"} />
          </div>
          <div
            className={classNames(
              styles.field,
              errors.nextVaccination && styles.error
            )}
          >
            {errors.nextVaccination && <span>required</span>}
            <label htmlFor="nextVaccination">Next vaccination</label>
            <Field id="nextVaccination" name="nextVaccination" type={"date"} />
          </div>

          <div className={styles.buttons}>
            <Button
              text="Save"
              onClick={() => {}}
              nativeType={"submit"}
              disabled={!!Object.keys(errors).length}
            />
            <Button text="Cancel" onClick={() => close()} type={"secondary"} />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PetForm;
