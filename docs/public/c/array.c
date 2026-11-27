#include <stdio.h>
#include <stdlib.h>
int a[100],i;
int n=0;
  void create()
    {
        printf("\n Total number of elements in the array : ");
        scanf("%d",&n);
        for(i=0;i < n; i++)
          {
                scanf("%d",&a[i]);
          }
    }
  void insert()
   {
       int pos,i,data;
           printf("\nPosition of insertion : ");
           scanf("%d",&pos);
           for(i=n-1;i>=pos-1;i--)
          {
                a[i+1]=a[i];
          }
        printf("Which value you want to add : ");
        scanf("%d",&data);
        a[pos-1]=data;
          printf("new array is \n");
          n++;
          for(i=0;i < n; i++)
          {
                  printf("%d\n",a[i]);
          }
  }
void delete(){
       int pos,i;
       printf("\nEnter the position of array to delete an element : ");
       scanf("%d",&pos);
          for(i=pos-1;i< n-1;i++)
           {
                 a[i]=a[i+1];
      }
          printf("New array is : \n ");
       n--;
       for(i=0;i < n; i++){
       printf("%d\n",a[i]);
       }}
void view(){
       int i;
       printf("Elements are : \n");
       for(i=0;i < n; i++){
       printf("%d\n",a[i]);
       }
}
int main() {
       int opt=0;
       while (1){
               printf("1) CREATE\n");
               printf("2) INSERT\n");
               printf("3) DELETE\n");
               printf("4) VIEW\n");
               printf("5) QUIET\n\n");
               printf("choose your option : ");
               scanf("%d",&opt);
               switch(opt){
                       case 1:
                               create();
                               break;
                       case 2:
                               insert();
                               break;
                       case 3:
                               delete();
                               break;
                       case 4:
                               view();
                               break;
                       case 5: exit(0);
                       default:
                               printf("Invalid option! Try Again.");
               }
       }
       return 0;
}
