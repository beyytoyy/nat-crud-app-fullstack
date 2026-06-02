import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { Table, Button, Container, Row, Col, Form, Alert } from "react-bootstrap";
import Papa from "papaparse"; // Import Papa for CSV parsing
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";

const NATDataList = () => {
  const [NATData, setNATData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    respondents: "",
    age: "",
    sex: "",
    ethnic: "",
    academicPerformance: "",
    academicDescription: "",
    iq: "",
    typeSchool: "",
    socioEconomicStatus: "",
    studyHabit: "",
    natResults: "",
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(5); // Number of items per page
  const [searchTerm, setSearchTerm] = useState("");

  // State for filters
  const [filterSex, setFilterSex] = useState("");
  const [filterTypeSchool, setFilterTypeSchool] = useState("");
  const [filterSES, setFilterSES] = useState("");
  const [filterStudyHabit, setFilterStudyHabit] = useState("");

   // Alert states
   const [showAlert, setShowAlert] = useState({ type: "", message: "" });

   // Alert timeout
  const showAlertMessage = (type, message) => {
    setShowAlert({ type, message });
    setTimeout(() => setShowAlert({ type: "", message: "" }), 3000); // Alert disappears after 3 seconds
  };

  useEffect(() => {
    const fetchData = async () => {
      const NATCollection = collection(db, "NATData");
      const NATSnapshot = await getDocs(NATCollection);
      const dataList = NATSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNATData(dataList);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const NATDocRef = doc(db, "NATData", id);
    try {
      await deleteDoc(NATDocRef);
      setNATData(NATData.filter((data) => data.id !== id));
      showAlertMessage("success", "Data deleted successfully!");
    } catch (error) {
      showAlertMessage("danger", "Error deleting data!");
      console.error("Error deleting document:", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      respondents: data.respondents,
      age: data.age,
      sex: data.sex,
      ethnic: data.ethnic,
      academicPerformance: data.academicPerformance,
      academicDescription: data.academicDescription,
      iq: data.iq,
      typeSchool: data.typeSchool,
      socioEconomicStatus: data.socioEconomicStatus,
      studyHabit: data.studyHabit,
      natResults: data.natResults,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const NATDocRef = doc(db, "NATData", editingId);
    try {
      await updateDoc(NATDocRef, editForm);
      setNATData(
        NATData.map((data) =>
          data.id === editingId ? { id: editingId, ...editForm } : data
        )
      );
      setEditingId(null);
      showAlertMessage("success", "Data updated successfully!");
    } catch (error) {
      showAlertMessage("danger", "Error updating data!");
      console.error("Error updating document:", error);
    }
  };

  // Handle CSV Upload
const handleCSVUpload = async (e) => {
  const file = e.target.files[0]; // Get the file
  if (file) {
    Papa.parse(file, {
      header: true, // Assumes the first row contains headers
      skipEmptyLines: true,
      complete: async function (results) {
        // Parse CSV data according to the provided headers
        const filteredData = results.data.map((row) => ({
          respondents: row['Respondents'], // Respondents field
          age: Number(row['Age']), // Convert Age to a number
          sex: row['sex'], // sex field
          ethnic: row['Ethnic'], // Ethnic field
          academicPerformance: Number(row['academic_perfromance']), // Correct spelling
          academicDescription: row['adamemic_description'], // Correct spelling
          iq: (row['IQ']), // IQ field, convert to number
          typeSchool: row['type_school'], // Type of school field
          socioEconomicStatus: row['socio_economic_status'], // Socio-economic status field
          studyHabit: row['Study_Habit'], // Study habit field
          natResults: Number(row['NAT_Results']), // NAT Results field, convert to number
        }));

        console.log("Parsed Data:", filteredData); // Log parsed data for debugging


        console.log("Cleaned Data:", filteredData); // Log the cleaned data for debugging

        if (filteredData.length === 0) {
          alert("No valid data found to upload.");
          return; // Exit if there's no data to upload
        }

        try {
          const batch = writeBatch(db); // Use Firestore batch operations for efficiency
          filteredData.forEach(data => {
            const docRef = doc(collection(db, "NATData")); // Ensure collection name matches
            batch.set(docRef, data); // Add each data object to Firestore
          });

          await batch.commit();
          setNATData(prevNATData => [...prevNATData, ...filteredData]); // Update the state with the new data
          showAlertMessage("success", "CSV file uploaded successfully!");
        } catch (error) {
          console.error("Error uploading data: ", error);
          showAlertMessage("danger", "Error uploading CSV data!");
        }
      },
      error: function (error) {
        console.error("Error parsing CSV file: ", error);
        alert("Error parsing CSV file. Please check the file format."); // Notify user of parsing error
      },
    });
  } else {
    alert("Please select a valid CSV file.");
  }
};
  

  // Filter data based on search term and filters
  const filteredData = NATData.filter((data) => {
    return (
      (data.respondents || "").toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterSex === "" || data.sex === filterSex) &&
      (filterTypeSchool === "" || data.typeSchool === filterTypeSchool) &&
      (filterSES === "" || data.socioEconomicStatus === filterSES) &&
      (filterStudyHabit === "" || data.studyHabit === filterStudyHabit)
    );
  });

  const totalPages = Math.ceil(filteredData.length / dataPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  return (
    <Container className="mt-4">
      {/* Alerts */}
      {showAlert.message && (
        <Alert variant={showAlert.type} className="text-center">
          {showAlert.message}
        </Alert>
      )}x
      <Row className="mb-3">
        <Col md={6}>
          <h3 className="">NAT Data List</h3>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <Form.Group>
            <Form.Control
              type="file"
              id="csvUpload"
              accept=".csv"
              onChange={handleCSVUpload}
              className="mb-2"
            />
          </Form.Group>
        </Col>
      </Row>
      <Container style={{background: '#e8e9eb', padding: '10px', borderRadius: '5px'}}>
      <Row className="mb-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col>
          <Form.Select value={filterSex} onChange={(e) => setFilterSex(e.target.value)}>
            <option value="">All Sexes</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Form.Select>
        </Col>
        <Col>
          <Form.Select value={filterTypeSchool} onChange={(e) => setFilterTypeSchool(e.target.value)}>
            <option value="">All Schools</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </Form.Select>
        </Col>
        <Col>
          <Form.Select value={filterSES} onChange={(e) => setFilterSES(e.target.value)}>
            <option value="">All SES</option>
            <option value="Above poverty line">Above poverty line</option>
            <option value="On poverty line">On poverty line</option>
            <option value="Below poverty line">Below poverty line</option>
          </Form.Select>
        </Col>
        <Col>
          <Form.Select value={filterStudyHabit} onChange={(e) => setFilterStudyHabit(e.target.value)}>
            <option value="">All Habits</option>
            <option value="Good">Good</option>
            <option value="Poor">Poor</option>
            <option value="Excellent">Excellent</option>
          </Form.Select>
        </Col>
      </Row>

      {editingId ? (
        <Form onSubmit={handleUpdate} className="mb-4">
          <h4>Edit Entry</h4>
          {Object.keys(editForm).map((key) => (
            <Form.Group key={key} className="mb-2">
              <Form.Label>
                {key
                  .charAt(0)
                  .toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
              </Form.Label>
              <Form.Control
                type="text"
                value={editForm[key]}
                onChange={(e) =>
                  setEditForm({ ...editForm, [key]: e.target.value })
                }
                required
              />
            </Form.Group>
          ))}
          <Button type="submit" variant="success" className="me-2">
            Update Data
          </Button>
          <Button variant="secondary" onClick={() => setEditingId(null)}>
            Cancel
          </Button>
        </Form>
      ) : (
        <Table striped bordered hover className="text-center mt-3">
          <thead>
            <tr>
              <th>Respondents</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Performance</th>
              <th>Description</th>
              <th>School</th>
              <th>SES</th>
              <th>Habit</th>
              <th>Results</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((data) => (
              <tr key={data.id}>
                <td>{data.respondents}</td>
                <td>{data.age}</td>
                <td>{data.sex}</td>
                <td>{data.academicPerformance}</td>
                <td>{data.academicDescription}</td>
                <td>{data.typeSchool}</td>
                <td>{data.socioEconomicStatus}</td>
                <td>{data.studyHabit}</td>
                <td>{data.natResults}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEdit(data)}
                    className="me-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(data.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Pagination controls */}
      <Row className="mt-3 align-items-center">
  {/* Dropdown to select number of entries */}
  <Col md={6} className="d-flex align-items-center">
    <span className="me-2">Show:</span>
    <Form.Select
      value={dataPerPage}
      onChange={(e) => setDataPerPage(Number(e.target.value))}
      style={{ width: "80px" }}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
    </Form.Select>
    <span style={{marginLeft: '5px'}}>
      of <strong>{NATData.length}</strong> entries
    </span>
  </Col>

  {/* Pagination controls aligned to the right */}
  <Col md={6} className="d-flex justify-content-end align-items-center">
    <Button
      variant="primary"
      className="d-flex justify-content-center align-items-center me-2"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      style={{background: '#036c5f'}}
      >
      Previous
    </Button>
    <span className="me-2">
      Page {currentPage} of {totalPages}
    </span>
    <Button
      variant="primary"
      className="d-flex justify-content-center align-items-center"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
      style={{background: '#036c5f'}}
    >
      Next
    </Button>
  </Col>
</Row>

      </Container>
    </Container>
  );
};

export default NATDataList;