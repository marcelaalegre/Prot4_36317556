import {pool} from './database.js';

class LibroController{
    
    async getAll(req, res) {
      // Obtener todos los libros
      try {
        const [result] = await pool.query("SELECT * FROM libros");
        res.json(result);
      } catch (error) {
        // Manejar cualquier error que ocurra durante la consulta
        res.status(500).json({ message: "Error al obtener los libros", error });
      }
    }

    async getOne(req, res) {
      // Obtener un libro por su ID
      const { id } = req.params;
      try {
        const [result] = await pool.query("SELECT * FROM libros WHERE id = ?", [
          id,
        ]);
  
        if (result.length === 0) {
          
          res.status(404).json({ message: "Libro no encontrado" });
        } else {
          res.json(result[0]);
        }
      } catch (error) {
        res.status(500).json({ message: "Error al obtener el libro", error });
      }
    }

    async add(req, res) {
      const libro = req.body;
      try {
        // Validar que solo se envíen atributos válidos
        if (
          !libro.nombre ||
          !libro.autor ||
          !libro.categoria ||
          !libro.anoPublicacion ||
          !libro.isbn
        ) {
          return res.status(400).json({ message: "Faltan atributos requeridos" });
        }
        const [result] = await pool.query(`INSERT INTO libros(nombre,autor,categoria,anoPublicacion,isbn) VALUES (?,?,?,?,?)`,[libro.nombre,libro.autor,libro.categoria,libro.anoPublicacion,libro.isbn]);
        res.json(("Libro insertado",result.insertid ));
      } catch (error) {
        // Manejar cualquier error que ocurra durante la inserción
        res.status(500).json({ message: "Error al agregar el libro", error });
      }
    }   
    
    async delete(req, res){
      // Eliminar un libro por su ID
      const { id } = req.body; // Se obtiene el ISBN desde el cuerpo de la solicitud
      try {
        // Primero, se busca el libro por su id
        const [result] = await pool.query(
          "SELECT id FROM libros WHERE id = ?",
          [id]
        );
  
        if (result.length === 0) {
          // Si no se encuentra el libro, devolver un error 404
          return res.status(404).json({ message: "Libro no encontrado" });
        }
  
        // Obtener el ID del libro encontrado
        const libro = req.body;
        const [deleteLibro] = await pool.query(`DELETE FROM libros WHERE id=(?)`, [libro.id]);
        if (deleteLibro.affectedRows === 0) {
          res.status(404).json({ message: "No se pudo eliminar el libro" });
        } else {
          res.json({ "Registros eliminados": deleteLibro.affectedRows });
        }
      } catch (error) {
        // Manejar cualquier error que ocurra durante la eliminación
        res.status(500).json({ message: "Error al eliminar el libro", error });
      }
    }

    async update(req, res){
      // Actualizar un libro existente
      const libro = req.body;
      try {
         // Primero, se busca el libro por su id    
         const { id } = req.body; 
         const [resultSearch] = await pool.query(
          "SELECT id FROM libros WHERE id = ?",
          [id]
        );
  
        if (resultSearch.length === 0) {
          // Si no se encuentra el libro, devolver un error 404
          return res.status(404).json({ message: "Libro no encontrado" });
        }
        // Validar que solo se envíen atributos válidos
        if (
          !libro.nombre ||
          !libro.autor ||
          !libro.categoria ||
          !libro.anoPublicacion ||
          !libro.isbn
        ) {
          return res.status(400).json({ message: "Faltan atributos requeridos" });
        }

        const [result] = await pool.query(`UPDATE libros SET nombre=(?), autor=(?), categoria=(?), anoPublicacion=(?), isbn=(?) WHERE id=(?)`,[libro.nombre, libro.autor, libro.categoria, libro.anoPublicacion, libro.isbn, libro.id]);
       
        if (result.changedRows === 0) {
          // Si no se actualizó ningún libro, devolver un error 404
          res.status(404).json({ message: "Libro no encontrado o sin cambios" });
        } else {
          res.json({ "Libro actualizado": result.changedRows });
        }
      } catch (error) {
        // Manejar cualquier error que ocurra durante la actualización
        res.status(500).json({ message: "Error al actualizar el libro", error });
      }
    } 
}
  
export const libro = new LibroController();