import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch customer data
export const fetchcustomer = createAsyncThunk("fetchcustomer", async () => {
  const response = await fetch("http://localhost:8000/CustomerApi/customer/");
  if (!response.ok) throw new Error("Failed to fetch customers");
  return response.json();
});

// Fetch organisation names
export const fetchOrganisationName = createAsyncThunk(
  "fetchOrganisationName",
  async () => {
    const response = await fetch(
      "http://localhost:8000/CustomerApi/customerlist/"
    );
    if (!response.ok) throw new Error("Failed to fetch Organisation Name");
    return response.json();
  }
);

export const customerSlice = createSlice({
  name: "customer",
  initialState: {
    isLoading: false,
    data: [],
    organisationNames: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchcustomer actions
      .addCase(fetchcustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchcustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchcustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.data = [];
        state.error = action.error.message;
      })
      // Handle fetchOrganisationName actions
      .addCase(fetchOrganisationName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganisationName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organisationNames = action.payload;
        state.error = null;
        localStorage.setItem(
          "organisationNames",
          JSON.stringify(action.payload)
        );
      })
      .addCase(fetchOrganisationName.rejected, (state, action) => {
        state.isLoading = false;
        state.organisationNames = [];
        state.error = action.error.message;
      });
  },
  reducers: {
    addCustomer: (state, action) => {
      state.data.push(action.payload);
    },
    deleteCustomer: (state, action) => {
      state.data = state.data.filter(
        (customer) => customer.id !== action.payload
      );
    },
    updateCustomer: (state, action) => {
      const index = state.data.findIndex(
        (customer) => customer.id === action.payload.id
      );
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload };
      }
    },
  },
});

export const { addCustomer, deleteCustomer, updateCustomer } =
  customerSlice.actions;
export default customerSlice.reducer;
