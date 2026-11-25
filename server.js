
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// 1. Configuracion de CORS
app.use(cors({
    origin: "http://localhost:5500",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "X-Red-Equipo"],
    exposedHeaders: ["X-Servidor-Procesado"]
}));

// 2. Permitir recibir datos JSON
app.use(express.json());

// 3. Configuracion del equipo
const N = 2;
const HEADER_ESPERADO = `CIAF-${N}`;

// 4. Middleware de autenticacion
function verificarEquipo(req, res, next) {

    const credencial = req.headers["x-red-equipo"];

    if (credencial !== HEADER_ESPERADO) {
        return res.status(401).json({
            error: "No autorizado",
            mensaje: "El encabezado X-Red-Equipo falta o es incorrecto."
        });
    }

    // Encabezado personalizado de respuesta
    res.setHeader(
        "X-Servidor-Procesado",
        `Equipo-${N}`
    );

    next();
}

// 5. Aplicar la validacion a las rutas API
app.use("/api", verificarEquipo);

// 6. Datos de ejemplo de la tienda
let productos = [
    {
        id: 1,
        nombre: "Camisa",
        precio: 45000,
        stock: 10
    },
    {
        id: 2,
        nombre: "Pantalon",
        precio: 85000,
        stock: 5
    }
];

// 7. Endpoint GET: consultar productos
app.get("/api/productos", (req, res) => {

    res.status(200).json({
        mensaje: "Productos consultados correctamente",
        productos: productos
    });

});

// 8. Endpoint POST: registrar productos
app.post("/api/productos", (req, res) => {

    const { nombre, precio, stock } = req.body;

    if (
        typeof nombre !== "string" ||
        !nombre.trim() ||
        typeof precio !== "number" ||
        precio <= 0 ||
        !Number.isInteger(stock) ||
        stock < 0
    ) {
        return res.status(400).json({
            error: "Datos incorrectos",
            mensaje: "Envia nombre, precio numerico positivo y stock entero no negativo."
        });
    }

    const nuevoProducto = {
        id: productos.length + 1,
        nombre: nombre.trim(),
        precio,
        stock
    };

    productos.push(nuevoProducto);

    res.status(201).json({
        mensaje: "Producto registrado correctamente",
        producto: nuevoProducto
    });

});

// 9. Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
