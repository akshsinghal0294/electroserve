import { useNavigate } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";

export default function Services() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Refrigerator Repair",
      description:
        "Expert fridge repair and maintenance service",
      price: 299,
      icon: "❄️",
    },
    {
      title: "AC Service",
      description:
        "Complete AC servicing and repair",
      price: 399,
      icon: "❄️",
    },
    {
      title: "TV Repair",
      description:
        "All brands TV repair service",
      price: 199,
      icon: "📺",
    },
    {
      title: "Washing Machine Repair",
      description:
        "Washing machine repair and maintenance",
      price: 299,
      icon: "🧺",
    },
    {
      title: "Microwave Repair",
      description:
        "Microwave oven repair and service",
      price: 199,
      icon: "🔥",
    },
    {
      title: "Other Appliances",
      description:
        "Any other appliance repair service",
      price: 149,
      icon: "🔧",
    },
  ];

  return (
    <div>
      <section
        style={{
          background: "#f3f4f6",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h1>Expert Repair Services</h1>

        <p>
          Quick and reliable repair
          for all your appliances
        </p>
      </section>

      <section
        style={{
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(280px,1fr))",
            gap: "20px",
          }}
        >
          {services.map((service) => (
            <div
              key={service.title}
              onClick={() =>
                navigate(
                  `/book-service?service=${encodeURIComponent(
                    service.title
                  )}`
                )
              }
            >
              <ServiceCard
                service={service}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}