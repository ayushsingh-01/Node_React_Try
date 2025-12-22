import { useState, useEffect } from "react";
import axios from "../api/axiosClient";
import { FiBookOpen, FiSearch, FiFilter } from "react-icons/fi";
import ResourceCard from "../components/ResourceCard";

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get("/resources");
        setResources(response.data);
        setFilteredResources(response.data);

        const uniqueCategories = [
          ...new Set(response.data.map((r) => r.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Failed to fetch resources", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    let result = resources;

    if (searchTerm) {
      result = result.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          resource.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedCategory) {
      result = result.filter(
        (resource) => resource.category === selectedCategory
      );
    }

    setFilteredResources(result);
  }, [searchTerm, selectedCategory, resources]);

  return (
    <>
      <div className="card mb-6">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div style={{ flex: "1 1 300px", position: "relative" }}>
            <FiSearch
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-tertiary)",
                fontSize: "1.25rem",
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "2.75rem" }}
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ flex: "0 0 200px", position: "relative" }}>
            <FiFilter
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-tertiary)",
                fontSize: "1.25rem",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <select
              className="form-select"
              style={{ paddingLeft: "2.75rem" }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center" style={{ padding: "3rem" }}>
          <div className="loading-spinner" style={{ margin: "0 auto" }}></div>
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-3" style={{ gap: "1.5rem" }}>
          {filteredResources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: "3rem" }}>
          <FiBookOpen
            style={{
              fontSize: "3rem",
              color: "var(--text-tertiary)",
              marginBottom: "1rem",
            }}
          />
          <p style={{ color: "var(--text-secondary)" }}>
            No resources found matching your criteria.
          </p>
        </div>
      )}
    </>
  );
};

export default ResourcesPage;
