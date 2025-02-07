import { useRef, useState } from "react";

const initialFriends = [
  {
    id: 1,
    name: "Anil",
    image: "https://i.pravatar.cc/150?img=68",
    balance: -7,
  },
  {
    id: 2,
    name: "Abhishek",
    image: "https://i.pravatar.cc/150?img=2",
    balance: 50,
  },
  {
    id: 3,
    name: "Sneha",
    image: "https://i.pravatar.cc/150?img=37",
    balance: 10,
  },
  {
    id: 4,
    name: "Sumedh",
    image: "https://i.pravatar.cc/150?img=8",
    balance: 0,
  },
];

export default function App() {
  const [friendsList, setFriendsList] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function showAddFriendHandler() {
    setShowAddFriend((show) => !show);
  }

  function AddFriendToList(obj) {
    setFriendsList((prev) => {
      return [...prev, obj];
    });

    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((current) => (current?.id === friend.id ? null : friend));

    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    
    setFriendsList(friendsList => friendsList.map(friend=>friend.id === selectedFriend.id ? {...friend,balance :friend.balance+ value} : friend))

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friendsList={friendsList}
          onSelect={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <AddFriendForm onAdd={AddFriendToList} />}
        <Button onClick={showAddFriendHandler}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ friendsList, onSelect, selectedFriend }) {
  return (
    <ul>
      {friendsList.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelect={onSelect}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} Rs{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you Rs{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button
        onClick={() => {
          onSelect(friend);
        }}
      >
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function AddFriendForm({ onAdd }) {
  const nameRef = useRef();
  const imageRef = useRef();

  function submitHandler(e) {
    console.log(imageRef);

    e.preventDefault();
    let friendObject = {
      id: crypto.randomUUID(),
      name: nameRef.current.value,
      image: imageRef.current.value,
      balance: 0,
    };

    onAdd(friendObject);

    nameRef.current.value = "";
    imageRef.current.value = "";
  }
  return (
    <form className="form-add-friend" onSubmit={submitHandler}>
      <label>🤵‍♂️ Friend Name</label>
      <input type="text" ref={nameRef} required />
      <label>🖼️ Image URL</label>
      <input type="text" ref={imageRef} required />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [billAmount, setBillAmount] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const toBePaidByFriend = billAmount ? billAmount - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function submitHandler(e) {
    e.preventDefault();

    if (!billAmount || !paidByUser) return;

    onSplitBill(whoIsPaying === "user" ? toBePaidByFriend : -paidByUser)
  

   
  }

  return (
    <form className="form-add-friend" onSubmit={submitHandler}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={billAmount}
        onChange={(e) => setBillAmount(Number(e.target.value))}
      />
      <label>🪙 Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > billAmount
              ? paidByUser
              : Number(e.target.value)
          )
        }
      />
      <label>🫰 {selectedFriend.name}'s Expense</label>
      <input type="text" value={toBePaidByFriend} disabled />
      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
