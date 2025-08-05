<?php
class Testimonial {
    private $conn;
    private $table_name = "testimonials";

    public $id;
    public $author;
    public $content;
    public $video_url;
    public $image_url;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET author=:author, content=:content, video_url=:video_url, image_url=:image_url";

        $stmt = $this->conn->prepare($query);

        $this->author = htmlspecialchars(strip_tags($this->author));
        $this->content = htmlspecialchars(strip_tags($this->content));
        $this->video_url = htmlspecialchars(strip_tags($this->video_url));
        $this->image_url = htmlspecialchars(strip_tags($this->image_url));

        $stmt->bindParam(":author", $this->author);
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":video_url", $this->video_url);
        $stmt->bindParam(":image_url", $this->image_url);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                SET author=:author, content=:content, video_url=:video_url, image_url=:image_url 
                WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $this->author = htmlspecialchars(strip_tags($this->author));
        $this->content = htmlspecialchars(strip_tags($this->content));
        $this->video_url = htmlspecialchars(strip_tags($this->video_url));
        $this->image_url = htmlspecialchars(strip_tags($this->image_url));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":author", $this->author);
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":video_url", $this->video_url);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function getTotalTestimonials() {
        $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }
}
?> 