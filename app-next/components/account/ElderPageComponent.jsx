"use client";
import { useAddressStore } from "@/store/useAddressStore";
import React, { useEffect, useState } from "react";
const initialAddress = {
  name: "",
  address: "",
  postalcode: "",
  city: "",
  country: "",
  phone: "",
  isDefault: false,
};
export default function ElderPageComponent({ user }) {
  const { createAddress, address, error, isLoading, fetchAddress } =
    useAddressStore();
  const [helpRequests, setHelpRequests] = useState([]);
  const [showAddress, setShhowAddress] = useState(false);
  const [formData, setFormdata] = useState(initialAddress);
  const addresses = Array.isArray(address) ? address : [];
  const handleAddAddress = async (event) => {
    event.preventDefault();
    try {
      const result = await createAddress(formData);
      if (result) {
        fetchAddress();
        setFormdata(initialAddress);
        setShhowAddress(false);
        alert("AddressCreated Successfully");
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);
  const handleEditAddress = async (addressId) => {
    console.log(addressId);
  };
  const handleDeleteAddress = async (addressId) => {
    console.log(addressId);
  };
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
          Request Help
        </h2>
        {helpRequests.length === 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Help Requested Yet. Add A new Help Request
            <button>Request Now</button>
          </div>
        )}
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
          My Addresses
        </h2>

        {isLoading && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
              textAlign: "center",
            }}
          >
            Loading…
          </div>
        )}

        {!isLoading && !error && addresses.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {addresses.map((address) => (
              <div
                key={address.id || address._id}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{address.name}</div>
                  {address.isDefault && (
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        background: "#f3f4f6",
                        color: "#374151",
                      }}
                    >
                      Default
                    </span>
                  )}
                </div>

                <div style={{ color: "#4b5563", fontSize: 14 }}>
                  {address.address}
                </div>
                <div style={{ color: "#4b5563", fontSize: 14 }}>
                  {address.city}, {address.country} {address.postalCode}
                </div>
                <div style={{ color: "#4b5563", fontSize: 14 }}>
                  {address.phone}
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <button onClick={() => handleEditAddress(address.id)}>
                    Edit Address
                  </button>
                  <button onClick={() => handleDeleteAddress(address.id)}>
                    delete Address
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && addresses.length === 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            No addresses yet. Add A new Address
            <button onClick={() => setShhowAddress(!showAddress)}>
              Add Address Now
            </button>
          </div>
        )}
        <div>
          {showAddress && (
            <form onSubmit={handleAddAddress}>
              <div>
                <label>Name</label>
                <input
                  id="name"
                  value={formData.name}
                  required
                  placeholder="Enter your Name"
                  onChange={(e) =>
                    setFormdata({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label>Address</label>
                <input
                  id="address"
                  value={formData.address}
                  required
                  placeholder="Enter your Address"
                  onChange={(e) =>
                    setFormdata({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label>City</label>
                <input
                  id="city"
                  value={formData.city}
                  required
                  placeholder="Enter your city"
                  onChange={(e) =>
                    setFormdata({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label>Country</label>
                <input
                  id="country"
                  value={formData.country}
                  required
                  placeholder="Enter your Country"
                  onChange={(e) =>
                    setFormdata({ ...formData, country: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label>Phone</label>
                <input
                  id="phone"
                  value={formData.phone}
                  required
                  placeholder="Enter your phone"
                  onChange={(e) =>
                    setFormdata({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Postal Code</label>
                <input
                  id="postalcode"
                  value={formData.postalcode}
                  required
                  placeholder="Enter your postal code"
                  onChange={(e) =>
                    setFormdata({
                      ...formData,
                      postalcode: e.target.value,
                    })
                  }
                />

                <div>
                  <button type="submit">Add Address</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
