export default function CartItem({
    item,
    onRemove,
    onUpdateQuantity,
  }) {
    return (
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          border: "1px solid #ddd",
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "10px",
        }}
      >
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          width="100"
        />
  
        <div style={{ flex: 1 }}>
          <h3>{item.product.name}</h3>
  
          <p>₹{item.product.price}</p>
  
          <div>
            <button
              onClick={() =>
                onUpdateQuantity(
                  item.id,
                  item.quantity - 1
                )
              }
            >
              -
            </button>
  
            <span
              style={{
                margin: "0 10px",
              }}
            >
              {item.quantity}
            </span>
  
            <button
              onClick={() =>
                onUpdateQuantity(
                  item.id,
                  item.quantity + 1
                )
              }
            >
              +
            </button>
          </div>
  
          <h4>
            ₹
            {item.product.price *
              item.quantity}
          </h4>
        </div>
  
        <button
          onClick={() => onRemove(item.id)}
          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          Remove
        </button>
      </div>
    );
  }