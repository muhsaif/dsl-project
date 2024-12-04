import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "./App.css";

// DSL parser function
const parseDSL = (dsl) => {
  const components = [];

  // Helper function to create styled ResizableBox
  const createResizable = (width, height, key, content) => (
    <ResizableBox
      width={parseInt(width, 10)}
      height={parseInt(height, 10)}
      minConstraints={[50, 30]}
      maxConstraints={[500, 300]}
      key={key}
    >
      {content}
    </ResizableBox>
  );

  // Button
  const buttonRegex =
    /Button\s*\{\s*text:\s*"([^"]+)";\s*width:\s*"([^"]+)";\s*height:\s*"([^"]+)";\s*color:\s*"([^"]+)";\s*\}/g;
  let match;
  while ((match = buttonRegex.exec(dsl)) !== null) {
    const [_, text, width, height, color] = match;
    components.push(
      createResizable(
        width,
        height,
        text,
        <button
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: color,
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {text}
        </button>,
      ),
    );
  }

  // Text Field
  const textFieldRegex =
    /TextField\s*\{\s*placeholder:\s*"([^"]+)";\s*width:\s*"([^"]+)";\s*height:\s*"([^"]+)";\s*\}/g;
  while ((match = textFieldRegex.exec(dsl)) !== null) {
    const [_, placeholder, width, height] = match;
    components.push(
      createResizable(
        width,
        height,
        placeholder,
        <input
          type="text"
          placeholder={placeholder}
          style={{
            width: "100%",
            height: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />,
      ),
    );
  }

  // Checkbox
  const checkboxRegex =
    /Checkbox\s*\{\s*label:\s*"([^"]+)";\s*checked:\s*(true|false);\s*width:\s*"([^"]+)";\s*height:\s*"([^"]+)";\s*\}/g;
  while ((match = checkboxRegex.exec(dsl)) !== null) {
    const [_, label, checked, width, height] = match;
    components.push(
      createResizable(
        width,
        height,
        label,
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={checked === "true"}
            style={{ marginRight: "10px" }}
          />
          {label}
        </label>,
      ),
    );
  }

  // Radio Button
  const radioButtonRegex =
    /RadioButton\s*\{\s*label:\s*"([^"]+)";\s*checked:\s*(true|false);\s*width:\s*"([^"]+)";\s*height:\s*"([^"]+)";\s*\}/g;
  while ((match = radioButtonRegex.exec(dsl)) !== null) {
    const [_, label, checked, width, height] = match;
    components.push(
      createResizable(
        width,
        height,
        label,
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="radio"
            checked={checked === "true"}
            style={{ marginRight: "10px" }}
          />
          {label}
        </label>,
      ),
    );
  }

  // Dropdown
  const dropdownRegex =
    /Dropdown\s*\{\s*options:\s*\[([^\]]+)\];\s*width:\s*"([^"]+)";\s*height:\s*"([^"]+)";\s*\}/g;
  while ((match = dropdownRegex.exec(dsl)) !== null) {
    const [_, options, width, height] = match;
    const optionList = options
      .split(",")
      .map((opt) => opt.trim().replace(/"/g, ""));
    components.push(
      createResizable(
        width,
        height,
        options,
        <select
          style={{
            width: "100%",
            height: "100%",
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        >
          {optionList.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>,
      ),
    );
  }

  // Label
  const labelRegex =
    /Label\s*\{\s*text:\s*"([^"]+)";\s*width:\s*"([^"]+)";\s*height:\s*"([^"]+)";\s*\}/g;
  while ((match = labelRegex.exec(dsl)) !== null) {
    const [_, text, width, height] = match;
    components.push(
      createResizable(
        width,
        height,
        text,
        <label
          style={{
            width: "100%",
            height: "100%",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8f9fa",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          {text}
        </label>,
      ),
    );
  }
  // Link
  const linkRegex = /Link\s*\{\s*text:\s*"([^"]+)";\s*url:\s*"([^"]+)";\s*\}/g;
  while ((match = linkRegex.exec(dsl)) !== null) {
    const [_, text, url] = match;
    components.push(
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#007bff",
          textDecoration: "none",
          fontSize: "16px",
        }}
      >
        {text}
      </a>,
    );
  }

  // Image
  const imageRegex =
    /Image\s*\{\s*src:\s*"([^"]+)";\s*alt:\s*"([^"]+)";\s*width:\s*"([^"]+)";\s*height:\s*"([^"]+)";\s*\}/g;
  while ((match = imageRegex.exec(dsl)) !== null) {
    const [_, src, alt, width, height] = match;
    components.push(
      <img
        src={src}
        alt={alt}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: "5px",
          objectFit: "cover",
        }}
      />,
    );
  }

  // Icon
  const iconRegex =
    /Icon\s*\{\s*name:\s*"([^"]+)";\s*color:\s*"([^"]+)";\s*size:\s*"([^"]+)";\s*\}/g;
  while ((match = iconRegex.exec(dsl)) !== null) {
    const [_, name, color, size] = match;
    components.push(
      <i
        className={`icon-${name}`}
        style={{
          color: color,
          fontSize: `${size}px`,
          display: "inline-block",
        }}
      />,
    );
  }

  // Modal
  const modalRegex =
    /Modal\s*\{\s*title:\s*"([^"]+)";\s*content:\s*"([^"]+)";\s*\}/g;
  while ((match = modalRegex.exec(dsl)) !== null) {
    const [_, title, content] = match;
    components.push(
      <div className="modal">
        <h2 style={{ marginBottom: "10px" }}>{title}</h2>
        <p>{content}</p>
      </div>,
    );
  }

  // Tooltip
  const tooltipRegex =
    /Tooltip\s*\{\s*text:\s*"([^"]+)";\s*tooltip:\s*"([^"]+)";\s*\}/g;
  while ((match = tooltipRegex.exec(dsl)) !== null) {
    const [_, text, tooltip] = match;
    components.push(
      <div className="tooltip">
        {text}
        <span className="tooltip-text">{tooltip}</span>
      </div>,
    );
  }

  // Card
  const cardRegex =
    /Card\s*\{\s*title:\s*"([^"]+)";\s*content:\s*"([^"]+)";\s*\}/g;
  while ((match = cardRegex.exec(dsl)) !== null) {
    const [_, title, content] = match;
    components.push(
      <div className="card">
        <h3 style={{ marginBottom: "10px" }}>{title}</h3>
        <p>{content}</p>
      </div>,
    );
  }

  // Table
  const tableRegex =
    /Table\s*\{\s*headers:\s*\[([^\]]+)\];\s*rows:\s*\[([^\]]+)\];\s*\}/g;
  while ((match = tableRegex.exec(dsl)) !== null) {
    const [_, headers, rows] = match;
    const headerArray = headers.split(",").map((h) => h.trim());
    const rowArray = rows
      .split(";")
      .map((r) => r.split(",").map((cell) => cell.trim()));
    components.push(
      <table>
        <thead>
          <tr>
            {headerArray.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowArray.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>,
    );
  }

  // List
  const listRegex =
    /List\s*\{\s*items:\s*\[([^\]]+)\];\s*ordered:\s*(true|false);\s*\}/g;
  while ((match = listRegex.exec(dsl)) !== null) {
    const [_, items, ordered] = match;
    const itemArray = items.split(",").map((item) => item.trim());
    components.push(
      ordered === "true" ? (
        <ol>
          {itemArray.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul>
          {itemArray.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ),
    );
  }

  // Spinner
  const spinnerRegex = /Spinner\s*\{\s*size:\s*"([^"]+)";\s*\}/g;
  while ((match = spinnerRegex.exec(dsl)) !== null) {
    const [_, size] = match;
    components.push(
      <div
        className="spinner"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${size / 8}px`,
        }}
      />,
    );
  }

  // Label

  // Alert
  const alertRegex =
    /Alert\s*\{\s*message:\s*"([^"]+)";\s*type:\s*"([^"]+)";\s*\}/g;
  while ((match = alertRegex.exec(dsl)) !== null) {
    const [_, message, type] = match;
    const alertColors = {
      success: "#d4edda",
      danger: "#f8d7da",
      warning: "#fff3cd",
      info: "#d1ecf1",
    };
    components.push(
      <div
        style={{
          padding: "10px",
          backgroundColor: alertColors[type] || "#e2e3e5",
          border: "1px solid transparent",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
      >
        {message}
      </div>,
    );
  }

  // Pagination
  const paginationRegex =
    /Pagination\s*\{\s*pages:\s*([\d]+);\s*active:\s*([\d]+);\s*\}/g;
  while ((match = paginationRegex.exec(dsl)) !== null) {
    const [_, pages, active] = match;
    const pageNumbers = Array.from(
      { length: parseInt(pages) },
      (_, i) => i + 1,
    );
    components.push(
      <div style={{ display: "flex", gap: "5px" }}>
        {pageNumbers.map((num) => (
          <button
            key={num}
            style={{
              padding: "5px 10px",
              backgroundColor: num === parseInt(active) ? "#007bff" : "#fff",
              color: num === parseInt(active) ? "#fff" : "#000",
              border: "1px solid #ccc",
              borderRadius: "3px",
            }}
          >
            {num}
          </button>
        ))}
      </div>,
    );
  }

  // Tab
  const tabRegex =
    /Tab\s*\{\s*labels:\s*\[([^\]]+)\];\s*active:\s*([\d]+);\s*\}/g;
  while ((match = tabRegex.exec(dsl)) !== null) {
    const [_, labels, active] = match;
    const labelArray = labels.split(",").map((label) => label.trim());
    components.push(
      <div style={{ display: "flex", gap: "5px" }}>
        {labelArray.map((label, i) => (
          <div
            key={i}
            style={{
              padding: "5px 10px",
              backgroundColor: i + 1 === parseInt(active) ? "#007bff" : "#fff",
              color: i + 1 === parseInt(active) ? "#fff" : "#000",
              border: "1px solid #ccc",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            {label}
          </div>
        ))}
      </div>,
    );
  }

  // Accordion
  const accordionRegex =
    /Accordion\s*\{\s*title:\s*"([^"]+)";\s*content:\s*"([^"]+)";\s*\}/g;
  while ((match = accordionRegex.exec(dsl)) !== null) {
    const [_, title, content] = match;
    components.push(
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
      >
        <div style={{ padding: "10px", fontWeight: "bold", cursor: "pointer" }}>
          {title}
        </div>
        <div style={{ padding: "10px", display: "none" }}>{content}</div>
      </div>,
    );
  }
  // Date Picker
  const datePickerRegex = /DatePicker\s*\{\s*label:\s*"([^"]+)";\s*\}/g;
  while ((match = datePickerRegex.exec(dsl)) !== null) {
    const [_, label] = match;
    components.push(
      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          {label}
        </label>
        <input
          type="date"
          style={{
            padding: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </div>,
    );
  }

  // File Input
  const fileInputRegex = /FileInput\s*\{\s*label:\s*"([^"]+)";\s*\}/g;
  while ((match = fileInputRegex.exec(dsl)) !== null) {
    const [_, label] = match;
    components.push(
      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          {label}
        </label>
        <input
          type="file"
          style={{
            padding: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </div>,
    );
  }

  // Textarea
  const textareaRegex = /Textarea\s*\{\s*label:\s*"([^"]+)";\s*\}/g;
  while ((match = textareaRegex.exec(dsl)) !== null) {
    const [_, label] = match;
    components.push(
      <div style={{ marginBottom: "10px" }}>
        <label
          style={{ marginBottom: "5px", fontWeight: "bold", display: "block" }}
        >
          {label}
        </label>
        <textarea
          rows="4"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </div>,
    );
  }

  // Navbar
  const navbarRegex =
    /Navbar\s*\{\s*title:\s*"([^"]+)";\s*links:\s*\[([^\]]+)\];\s*\}/g;
  while ((match = navbarRegex.exec(dsl)) !== null) {
    const [_, title, links] = match;
    const linkArray = links
      .split(",")
      .map((link) => link.split("/").map((item) => item.trim()));
    components.push(
      <nav
        style={{
          backgroundColor: "#007bff",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          color: "#fff",
        }}
      >
        <div style={{ fontWeight: "bold" }}>{title}</div>
        <div>
          {linkArray.map(([text, url], i) => (
            <a
              key={i}
              href={url}
              style={{
                marginLeft: "10px",
                color: "#fff",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              {text}
            </a>
          ))}
        </div>
      </nav>,
    );
  }

  // Footer
  const footerRegex = /Footer\s*\{\s*text:\s*"([^"]+)";\s*\}/g;
  while ((match = footerRegex.exec(dsl)) !== null) {
    const [_, text] = match;
    components.push(
      <footer
        style={{
          backgroundColor: "#f1f1f1",
          padding: "10px",
          textAlign: "center",
          borderTop: "1px solid #ccc",
        }}
      >
        {text}
      </footer>,
    );
  }

  // Sidebar
  const sidebarRegex =
    /Sidebar\s*\{\s*title:\s*"([^"]+)";\s*links:\s*\[([^\]]+)\];\s*\}/g;
  while ((match = sidebarRegex.exec(dsl)) !== null) {
    const [_, title, links] = match;
    const linkArray = links
      .split(",")
      .map((link) => link.split("/").map((item) => item.trim()));
    components.push(
      <aside
        style={{
          width: "250px",
          backgroundColor: "#f8f9fa",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "10px" }}>{title}</div>
        <ul style={{ listStyle: "none", padding: "0" }}>
          {linkArray.map(([text, url], i) => (
            <li key={i} style={{ marginBottom: "5px" }}>
              <a
                href={url}
                style={{
                  color: "#007bff",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </aside>,
    );
  }

  // Badge
  const badgeRegex =
    /Badge\s*\{\s*text:\s*"([^"]+)";\s*color:\s*"([^"]+)";\s*\}/g;
  while ((match = badgeRegex.exec(dsl)) !== null) {
    const [_, text, color] = match;
    components.push(
      <span
        style={{
          padding: "5px 10px",
          backgroundColor: color,
          color: "#fff",
          borderRadius: "10px",
          fontWeight: "bold",
        }}
      >
        {text}
      </span>,
    );
  }

  // Toast (Notification)
  const toastRegex =
    /Toast\s*\{\s*message:\s*"([^"]+)";\s*duration:\s*([\d]+);\s*\}/g;
  while ((match = toastRegex.exec(dsl)) !== null) {
    const [_, message, duration] = match;
    components.push(
      <div
        style={{
          padding: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "5px",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          minWidth: "200px",
          textAlign: "center",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          animation: `fadeout ${duration / 1000}s ease-in`,
        }}
      >
        {message}
      </div>,
    );
  }
  // Add the new UI elements to your existing code

// Slider
const sliderRegex =
/Slider\s*\{\s*min:\s*"([^"]+)";\s*max:\s*"([^"]+)";\s*step:\s*"([^"]+)";\s*value:\s*"([^"]+)";\s*width:\s*"([^"]+)";\s*height:\s*"([^"]+)";\s*\}/g;
while ((match = sliderRegex.exec(dsl)) !== null) {
const [_, min, max, step, value, width, height] = match;
components.push(
  createResizable(
    width,
    height,
    `Slider ${value}`,
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      style={{
        width: "100%",
        height: "100%",
        appearance: "none",
        backgroundColor: "#ddd",
      }}
      onChange={(e) => {}}
    />,
  )
);
}

// ProgressBar
const progressBarRegex =
/ProgressBar\s*\{\s*value:\s*"([^"]+)";\s*max:\s*"([^"]+)";\s*width:\s*"([^"]+)";\s*height:\s*"([^"]+)";\s*\}/g;
while ((match = progressBarRegex.exec(dsl)) !== null) {
const [_, value, max, width, height] = match;
components.push(
  createResizable(
    width,
    height,
    `ProgressBar ${value}`,
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#ddd",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${(parseInt(value) / parseInt(max)) * 100}%`,
          height: "100%",
          backgroundColor: "#4caf50",
        }}
      />
    </div>
  )
);
}

// Grid
const gridRegex =
/Grid\s*\{\s*columns:\s*"([^"]+)";\s*rows:\s*"([^"]+)";\s*\}/g;
while ((match = gridRegex.exec(dsl)) !== null) {
const [_, columns, rows] = match;
components.push(
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gap: "10px",
      marginBottom: "20px",
    }}
  >
    {Array.from({ length: columns * rows }).map((_, i) => (
      <div
        key={i}
        style={{
          backgroundColor: "#f1f1f1",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        Grid Item {i + 1}
      </div>
    ))}
  </div>
);
}

// Input Group
const inputGroupRegex =
/InputGroup\s*\{\s*label:\s*"([^"]+)";\s*inputs:\s*\[([^\]]+)\];\s*\}/g;
while ((match = inputGroupRegex.exec(dsl)) !== null) {
const [_, label, inputs] = match;
const inputList = inputs.split(",").map((input) => input.trim());
components.push(
  <div style={{ marginBottom: "10px" }}>
    <label style={{ fontWeight: "bold", marginRight: "10px" }}>
      {label}
    </label>
    <div style={{ display: "flex", gap: "10px" }}>
      {inputList.map((input, i) => (
        <input
          key={i}
          type="text"
          placeholder={input}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "16px",
            flex: 1,
          }}
        />
      ))}
    </div>
  </div>
);
}

// Forms
const formRegex =
/Form\s*\{\s*fields:\s*\[([^\]]+)\];\s*\}/g;
while ((match = formRegex.exec(dsl)) !== null) {
const [_, fields] = match;
const fieldList = fields.split(",").map((field) => field.trim());
components.push(
  <form
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      marginBottom: "20px",
    }}
  >
    {fieldList.map((field, i) => (
      <div key={i} style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ fontWeight: "bold", marginBottom: "10px" }}>
          {field}
        </label>
        <input
          type="text"
          placeholder={field}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>
    ))}
    <button
      type="submit"
      style={{
        padding: "10px",
        backgroundColor: "#007bff",
        color: "#fff",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Submit
    </button>
  </form>
);
}

// Carousel
const carouselRegex =
/Carousel\s*\{\s*images:\s*\[([^\]]+)\];\s*interval:\s*"([^"]+)";\s*\}/g;
while ((match = carouselRegex.exec(dsl)) !== null) {
const [_, images, interval] = match;
const imageArray = images.split(",").map((image) => image.trim());
components.push(
  <div style={{ position: "relative", width: "100%", height: "300px" }}>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        overflowX: "scroll",
        scrollBehavior: "smooth",
        transition: `transform ${interval}s ease`,
      }}
    >
      {imageArray.map((image, i) => (
        <img
          key={i}
          src={image}
          alt={`Carousel Item ${i + 1}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "5px",
          }}
        />
      ))}
    </div>
  </div>
);
}


  

  return components;
};

// Main App Component
function App() {
  const [dsl, setDSL] = useState("");

  return (
    <div style={{ padding: "20px" }}>
      <textarea
        rows={10}
        cols={50}
        value={dsl}
        onChange={(e) => setDSL(e.target.value)}
        placeholder="Enter DSL here..."
        style={{ marginBottom: "20px", width: "100%", fontSize: "16px" }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", flexDirection:"column"  }}>
        {parseDSL(dsl)}
      </div>
    </div>
  );
}

export default App;
