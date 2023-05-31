"use client";
// Import the useFormik hook from the formik library
import { useFormik } from "formik";
// Define a functional component Data
export default function QuoteCalculator() {
  // Initialize the formik object with initial values and an empty submit function
  const formik = useFormik({
    initialValues: {
      reamCost: 0,
      reamNum: 0,
      transport: 0,
      filmCost: 0,
      plateCost: 0,
      plateNum: 0,
      printCost: 0,
      trimCost: 0,
      packCost: 0,
      misc: 0,
    },
    onSubmit: (values) => {},
  });

  // Calculate the total cost by multiplying the input values with appropriate factors
  const total =
    formik.values.reamCost * formik.values.reamNum +
    formik.values.transport * 1 +
    formik.values.filmCost * formik.values.plateNum +
    formik.values.plateCost * formik.values.plateNum +
    formik.values.printCost * 2 +
    formik.values.trimCost * 1 +
    formik.values.packCost * formik.values.reamNum +
    formik.values.misc;

  // Calculate the quote by adding a profit margin and rounding up to the nearest multiple of 200
  const quote = Math.ceil((total * 1.35) / 200) * 200;
  // Calculate the tax by multiplying the quote with a tax rate
  const tax = Math.round(0.16 * quote);
  // Calculate the profit by subtracting the total cost from the quote
  const profit = quote - total;
  // Calculate the percentage profit by dividing the profit by the total cost
  const percProf = (Math.round((profit / total) * 10000) / 100).toFixed(2);

  // Return a JSX div element with a form inside
  return (
    <div className="m-4 flex gap-4">
      <form className="p-4 w-2/3 bg-slate-400 bg-light-blue grid grid-cols-4 gap-3 rounded-lg">
        <div>
          <label htmlFor="reamCost" className=" block mb-5 uppercase text-xs">
            Cost of a ream of paper
          </label>
          <input
            type="number"
            name="reamCost"
            placeholder="0"
            min={1}
            onChange={formik.handleChange}
            value={formik.values.reamCost}
            className="bg-transparent text-black  text-2xl placeholder-black focus: focus:border-l-4 border-gray-700 border-gray w-28 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="reamNum" className=" block mb-5 uppercase text-xs">
            Number of Reams
          </label>
          <input
            type="number"
            placeholder="0"
            min={1}
            name="reamNum"
            onChange={formik.handleChange}
            value={formik.values.reamNum}
            className="bg-transparent text-black  text-2xl placeholder-black focus:border-l-4 border-gray-700 border-gray w-28 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="transport" className=" block mb-5 uppercase text-xs">
            Transport Cost
          </label>
          <input
            type="number"
            placeholder="0"
            min={1}
            name="transport"
            onChange={formik.handleChange}
            value={formik.values.transport}
            className="bg-transparent text-black  text-2xl placeholder-black focus:border-l-4 border-gray-700 border-gray w-28 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="filmCost" className=" block mb-5 uppercase text-xs">
            Cost of Film
          </label>
          <input
            type="number"
            placeholder="0"
            min={1}
            name="filmCost"
            onChange={formik.handleChange}
            value={formik.values.filmCost}
            className="bg-transparent text-black  text-2xl placeholder-black focus:border-l-4 border-gray-700 border-gray w-28 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="plateCost" className=" block mb-5 uppercase text-xs">
            Cost of Plate
          </label>
          <input
            type="number"
            placeholder="0"
            min={1}
            name="plateCost"
            onChange={formik.handleChange}
            value={formik.values.plateCost}
            className="bg-transparent text-black  text-2xl placeholder-black focus:border-l-4 border-gray-700 border-gray w-28 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="plateNum" className=" block mb-5 uppercase text-xs">
            Number of Plates
          </label>
          <input
            type="number"
            placeholder="0"
            min={1}
            name="plateNum"
            onChange={formik.handleChange}
            value={formik.values.plateNum}
            className="bg-transparent text-black  text-2xl placeholder-black focus:border-l-4 border-gray-700 border-gray w-28 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="printCost" className=" block mb-5 uppercase text-xs">
            Printing
          </label>
          <input
            type="number"
            placeholder="0"
            min={1}
            name="printCost"
            onChange={formik.handleChange}
            value={formik.values.printCost}
            className="bg-transparent text-black  text-2xl placeholder-black focus:border-l-4 border-gray-700 border-gray w-28 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="trimCost" className=" block mb-5 uppercase text-xs">
            Trimming/ Cutting
          </label>
          <input
            type="number"
            placeholder="0"
            min={1}
            name="trimCost"
            onChange={formik.handleChange}
            value={formik.values.trimCost}
            className="bg-transparent text-black  text-2xl placeholder-black focus:border-l-4 border-gray-700 border-gray w-28 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="packCost" className=" block mb-5 uppercase text-xs">
            Packing
          </label>
          <input
            type="number"
            placeholder="0"
            min={1}
            name="packCost"
            onChange={formik.handleChange}
            value={formik.values.packCost}
            className="bg-transparent text-black  text-2xl placeholder-black focus:border-l-4 border-gray-700 border-gray w-28 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="misc" className=" block mb-5 uppercase text-xs">
            Miscellaneous
          </label>
          <input
            type="number"
            placeholder="0"
            min={1}
            name="misc"
            onChange={formik.handleChange}
            value={formik.values.misc}
            className="bg-transparent text-black  text-2xl placeholder-black focus:border-l-4 border-gray-700 border-gray w-28 rounded-md"
          />
        </div>
        <button type="submit" className="bg-blue block mb-5 uppercase text-xs rounded-full">Send it</button>
        <button type="button" className="bg-blue block mb-5 uppercase text-xs rounded-full">Generate PDF</button>
      </form>

      <div className="p-4 w-1/3 bg-gray rounded-lg grid grid-cols-2 gap-3">
        <div>
          <p className=" block mb-5 uppercase text-xs">Total</p>
          <p className="bg-transparent text-black  text-2xl">{total}</p>
        </div>

        <div>
          <p className=" block mb-5 uppercase text-xs">Amount to be quoted</p>
          <p className="bg-transparent text-black  text-2xl">{quote}</p>
        </div>

        <div>
          <p className=" block mb-5 uppercase text-xs">16% VAT</p>
          <p className="bg-transparent text-black  text-2xl">{tax}</p>
        </div>

        <div>
          <p className=" block mb-5 uppercase text-xs">Profit</p>
          <p className="bg-transparent text-black  text-2xl">{profit}</p>
        </div>

        <div>
          <p className=" block mb-5 uppercase text-xs">Percentage Profit</p>
          <p className="bg-transparent text-black  text-2xl">{percProf}%</p>
        </div>

        <div>
          <p className=" block mb-5 uppercase text-xs">Tithe</p>
          <p className="bg-transparent text-black  text-2xl">{0.12 * profit}</p>
        </div>
      </div>
    </div>
  );
}
