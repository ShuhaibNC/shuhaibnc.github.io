#include<stdio.h>
#include<stdlib.h>
struct node {
   int data;
   struct node *left, *right;
};
struct node* root = NULL;
struct node* create(int data) {
   struct node* newnode;
    newnode = (struct node*)malloc(sizeof(struct node));
     newnode->data = data;
     newnode->left = newnode->right = NULL;
     return newnode;
}
struct node* insert(struct node* root, int data) {
  if (root == NULL)
     return create(data);
  if (data < root->data) {
     root->left = insert(root->left, data);
  } else {
     root->right = insert(root->right, data);
  }
  return root;
}
void inorder(struct node* root) {
  if (root != NULL) {
     inorder(root->left);
     printf("%d ", root->data);
     inorder(root->right);
  }
}
struct node* search(struct node*root, int data){
         if (root == NULL || root->data == data){
                  return root;
                  }if(data < root->data){
                          return search(root->left,data);
                  }else{
                          return search(root->right,data);
                   }
         }
struct node* findMin(struct node* root) {
  while (root->left != NULL) {
     root = root->left;
  }
  return root;
}
struct node* delete(struct node* root, int data) {
  if (root == NULL)
     return root;
  if (data < root->data) {
     root->left = delete(root->left, data);
  }
  else if (data > root->data) {
     root->right = delete(root->right, data);
  }
  else {
     if (root->left == NULL && root->right == NULL) {
        free(root);
    return NULL;
     }else if (root->left == NULL) {
       struct node* temp = root->right;
       free(root);
       return temp;
     }
else if (root->right == NULL) {
       struct node* temp = root->left;
  free(root);
       return temp;
     }else {
       struct node* temp = findMin(root->right);
       root->data = temp->data;
       root->right = delete(root->right, temp->data);
     }
  }
  return root;
}
int main() {
  int opt, data;
  do {
    printf("\n1. Insert\n");
    printf("2. Deletion\n");
    printf("3. Display inorder\n");
    printf("4. Exit\n");
    printf("Enter the option: ");
    scanf("%d", &opt);
   switch (opt) {
     case 1:
       printf("Enter the data: ");
       scanf("%d", &data);
       root = insert(root, data);
       printf("Value %d inserted into the BST.\n", data);
       break;
     case 2:
       printf("Enter the data to delete: ");
       scanf("%d", &data);
       root = delete(root, data);
       printf("Value %d deleted from the BST.\n", data);
       break;
     case 3:
       printf("Inorder Traversal: ");
       inorder(root);
       printf("\n");
       break;
     case 4: printf("enter the element for searching: ");
       scanf("%d",&data);
       struct node *found=search(root,data);
         if(found){
            printf("data %d is founded",data);
         }else
            printf("value not found");
         break;
       case 5: exit(0);
       default: printf("Invalid option..\n");
      }
    } while (1);
    return 0;
}
