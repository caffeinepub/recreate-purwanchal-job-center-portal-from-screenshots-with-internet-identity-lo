import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  // Persistent Storage
  include MixinStorage();

  // Authentication state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  public type UserProfile = {
    firstName : Text;
    lastName : Text;
    email : Text;
    resume : ?Storage.ExternalBlob;
  };

  public type JobVacancy = {
    id : Nat;
    title : Text;
    description : Text;
    requirements : [Text];
    salaryRange : Text;
    postedAt : Time.Time;
  };

  public type Application = {
    id : Nat;
    jobId : Nat;
    user : Principal;
    coverLetter : Text;
    appliedAt : Time.Time;
    resume : ?Storage.ExternalBlob;
    status : ApplicationStatus;
  };

  public type ApplicationStatus = {
    #pending;
    #reviewed;
    #accepted;
    #rejected;
  };

  public type Post = {
    id : Nat;
    title : Text;
    content : Text;
    author : Principal;
    createdAt : Time.Time;
    image : ?Storage.ExternalBlob;
  };

  public type Message = {
    id : Nat;
    sender : Principal;
    receiver : Principal;
    content : Text;
    sentAt : Time.Time;
  };

  // Data Stores
  let userProfiles = Map.empty<Principal, UserProfile>();
  let jobVacancies = Map.empty<Nat, JobVacancy>();
  let applications = Map.empty<Nat, Application>();
  let posts = Map.empty<Nat, Post>();
  let messages = Map.empty<Nat, Message>();

  var nextJobId = 1;
  var nextAppId = 1;
  var nextPostId = 1;
  var nextMsgId = 1;

  module JobVacancy {
    public func compare(a : JobVacancy, b : JobVacancy) : Order.Order {
      Int.compare(b.postedAt, a.postedAt);
    };
  };

  module Application {
    public func compare(a : Application, b : Application) : Order.Order {
      Int.compare(b.appliedAt, a.appliedAt);
    };
  };

  module Post {
    public func compare(a : Post, b : Post) : Order.Order {
      Int.compare(b.createdAt, a.createdAt);
    };
  };

  module Message {
    public func compareBySentAt(a : Message, b : Message) : Order.Order {
      Int.compare(b.sentAt, a.sentAt);
    };
  };

  // User Profile Management
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Job Vacancies
  public shared ({ caller }) func createJobVacancy(vacancy : JobVacancy) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create job vacancies");
    };

    let jobId = nextJobId;
    nextJobId += 1;

    let newVacancy = {
      vacancy with
      id = jobId;
      postedAt = Time.now();
    };

    jobVacancies.add(jobId, newVacancy);
    jobId;
  };

  public shared ({ caller }) func updateJobVacancy(jobId : Nat, vacancy : JobVacancy) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update job vacancies");
    };

    switch (jobVacancies.get(jobId)) {
      case (null) { Runtime.trap("Job vacancy does not exist") };
      case (?existing) {
        let updatedVacancy = {
          vacancy with
          id = jobId;
          postedAt = existing.postedAt;
        };
        jobVacancies.add(jobId, updatedVacancy);
      };
    };
  };

  public shared ({ caller }) func deleteJobVacancy(jobId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete job vacancies");
    };

    ignore jobVacancies.remove(jobId);
  };

  public query func getJobVacancies() : async [JobVacancy] {
    jobVacancies.values().toArray().sort();
  };

  public query ({ caller }) func searchJobVacancies(searchTerm : ?Text) : async [JobVacancy] {
    let filtered = jobVacancies.values().toArray().sort().filter(
      func(vacancy) {
        switch (searchTerm) {
          case (null) { true };
          case (?term) {
            vacancy.title.contains(#text term) or vacancy.description.contains(#text term);
          };
        };
      }
    );
    filtered;
  };

  public query ({ caller }) func getJobVacancy(jobId : Nat) : async JobVacancy {
    switch (jobVacancies.get(jobId)) {
      case (null) { Runtime.trap("Job vacancy does not exist") };
      case (?job) { job };
    };
  };

  // Applications
  public shared ({ caller }) func applyForJob(jobId : Nat, coverLetter : Text, resume : ?Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can apply for jobs");
    };

    switch (jobVacancies.get(jobId)) {
      case (null) { Runtime.trap("Job vacancy does not exist") };
      case (?_) {
        let appId = nextAppId;
        nextAppId += 1;

        let newApp = {
          id = appId;
          jobId;
          user = caller;
          coverLetter;
          appliedAt = Time.now();
          resume;
          status = #pending;
        };

        applications.add(appId, newApp);
        appId;
      };
    };
  };

  public query ({ caller }) func getMyApplications() : async [Application] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view applications");
    };
    applications.values().toArray().sort().filter(
      func(app) { app.user == caller }
    );
  };

  public query ({ caller }) func getAllApplications() : async [Application] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all applications");
    };
    applications.values().toArray().sort();
  };

  public shared ({ caller }) func updateApplicationStatus(appId : Nat, status : ApplicationStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update application status");
    };

    switch (applications.get(appId)) {
      case (null) { Runtime.trap("Application does not exist") };
      case (?app) {
        let updatedApp = {
          app with
          status = status;
        };
        applications.add(appId, updatedApp);
      };
    };
  };

  // Admin Posts/Updates
  public shared ({ caller }) func createPost(title : Text, content : Text, image : ?Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create posts");
    };

    let postId = nextPostId;
    nextPostId += 1;

    let newPost = {
      id = postId;
      title;
      content;
      author = caller;
      createdAt = Time.now();
      image;
    };

    posts.add(postId, newPost);
    postId;
  };

  public shared ({ caller }) func updatePost(postId : Nat, title : Text, content : Text, image : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update posts");
    };

    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post does not exist") };
      case (?existing) {
        let updatedPost = {
          id = postId;
          title;
          content;
          author = existing.author;
          createdAt = existing.createdAt;
          image;
        };
        posts.add(postId, updatedPost);
      };
    };
  };

  public shared ({ caller }) func deletePost(postId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };

    ignore posts.remove(postId);
  };

  public query func getPosts() : async [Post] {
    posts.values().toArray().sort();
  };

  // Messaging
  public shared ({ caller }) func sendMessage(receiver : Principal, content : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let msgId = nextMsgId;
    nextMsgId += 1;

    let newMsg = {
      id = msgId;
      sender = caller;
      receiver;
      content;
      sentAt = Time.now();
    };

    messages.add(msgId, newMsg);
    msgId;
  };

  public query ({ caller }) func getInbox() : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };
    messages.values().toArray().sort(Message.compareBySentAt).filter(
      func(msg) { msg.receiver == caller }
    );
  };

  public query ({ caller }) func getSentMessages() : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };
    messages.values().toArray().sort(Message.compareBySentAt).filter(
      func(msg) { msg.sender == caller }
    );
  };
};
