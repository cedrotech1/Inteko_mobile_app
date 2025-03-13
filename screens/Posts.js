import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_BASE_URL } from '@env';
const CitizenPostsScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({});
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null); // Add state for token

  useEffect(() => {
    const loadUserData = async () => {
      const storedToken = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
      if (storedToken) {
        setToken(storedToken); // Set token in state
      }
    };

    loadUserData();
  }, []); // Load token on component mount

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) return; // Avoid fetching posts if token is not available

      try {
        const response = await fetch(`${REACT_APP_BASE_URL}/api/v1/post/citizen`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.success) {
          setPosts(result.data);
        } else {
          setPosts([]);
        }
      } catch (err) {
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]); // Only fetch posts when token is available

  const fetchComments = async (postId) => {
    if (!token) return; // Avoid fetching comments if token is not available

    try {
      const response = await fetch(`${REACT_APP_BASE_URL}/api/v1/post/one/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      console.log('Comments Response:', result); // Debugging: Log the API response
      if (result.success) {
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: result.data.comments,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText) {
      alert("Please enter a comment.");
      return;
    }
  
    if (!token) return; // Avoid submitting if token is not available
  
    try {
      const response = await fetch(`${REACT_APP_BASE_URL}/api/v1/post/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: commentText,
          postID: postId,
        }),
      });
  
      if (response.ok) {
        const newComment = await response.json();
        console.log('New Comment Response:', newComment); // Debugging: Log the new comment response
  
        // Update local comments state for the specific post
        // setComments((prevComments) => ({
        //   ...prevComments,
        //   [postId]: [
        //     ...(prevComments[postId] || []),
        //     newComment.data, // Assuming newComment.data contains the comment details
        //   ],
        // }));
  
        setCommentText(''); // Clear the input after submission
  
        // Show success alert
        alert('Comment added successfully!');
  
        // Reload the comments for the post (optional)
        fetchComments(postId);
  
      } else {
        alert('Failed to add comment');
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };
  
  

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📢 POSTS FROM YOUR VILLAGE</Text>
      {posts.length > 0 ? (
        posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text>{post.description}</Text>

            <View style={styles.status}>
              {post.attendances.length > 0 ? (
                <Text style={styles.attendedText}>You attended this meeting.</Text>
              ) : post.penalties.length > 0 ? (
                post.penalties[0].status === 'un paid' ? (
                  <Text style={styles.penaltyText}>
                    Penalty: {post.penalties[0].penarity} (Not yet paid)
                  </Text>
                ) : (
                  <Text style={styles.penaltyPaidText}>
                    Penalty {post.penalties[0].penarity} paid successfully!
                  </Text>
                )
              ) : (
                <Text style={styles.missedText}>You did not attend this meeting!</Text>
              )}
            </View>

            <Button title="View Comments" onPress={() => fetchComments(post.id)} />

            {comments[post.id] && comments[post.id].length > 0 && (
  <View style={styles.commentsSection}>
    {comments[post.id].map((comment) => (
      <View key={comment.id} style={styles.comment}>
        {/* Add optional chaining here */}
        <Image
          source={{ uri: comment.user?.image || 'http://res.cloudinary.com/dzl8xve8s/image/upload/v1741895856/Card/rbs0fdlsmj6yctoshexp.png' }}
          style={styles.commentAvatar}
        />
        <View style={styles.commentText}>
          <Text style={styles.commentAuthor}>
            {/* Use optional chaining to check user data */}
            {comment.user?.firstname} {comment.user?.lastname}
          </Text>
          <Text>{comment.comment}</Text>
          <Text style={styles.commentDate}>
            Posted at {new Date(comment.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>
    ))}
  </View>
)}


            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <Button title="Submit Comment" onPress={() => handleCommentSubmit(post.id)} />
          </View>
        ))
      ) : (
        <Text>No posts available at the moment.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 16,
  },
  postCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    marginVertical: 8,
  },
  attendedText: {
    color: 'green',
  },
  penaltyText: {
    color: 'red',
  },
  penaltyPaidText: {
    color: 'green',
  },
  missedText: {
    color: 'orange',
  },
  commentsSection: {
    marginTop: 16,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#f7f7f7',
    padding: 8,
    borderRadius: 8,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentText: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: 'bold',
  },
  commentDate: {
    fontSize: 12,
    color: '#888',
  },
  commentInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
});

export default CitizenPostsScreen;
