class UsersController < ApplicationController

  def new
  end

  def create
    if !User.find_by_email(user_signup_params[:email])
          @user = User.new(user_signup_params)
          @user.save
          session[:user_id] = @user.id
          render json: @user          
    else
      flash[:notice] = "email already assigned to account. Please log in."
      render json: {message: "email already assigned to account. 
        Please log in. If you forgot your password you can recover it"}, status: :conflict   
    end
  end

  def index
    @users = User.all
  end

  def show
    # @user = User.find(session[:user_id])
    @current_user = User.find_by_id(session[:user_id])
    if params[:id] != "show"
      if User.exists?(params[:id])
        @user = User.find(params[:id])
      else
        redirect_to "/"
      end
    else
      @user = User.find(session[:user_id])
    end
      user_hash_to_json = {id:@user.id}
      if @user == @current_user
        user_hash_to_json[:user] = @user
      end
      if @user.tenders
        user_hash_to_json[:tenders] = true
      end
      if @user.jobs
        user_hash_to_json[:jobs] = true
      end
      if @user.profession != 'customer'
        comments=[]
        @user.tenders.where(accepted: true).each do |tender|
          if tender.comment
            comments << {comment:tender.comment,user: tender.job.user.username}
          end
        end
        user_hash_to_json << comments if comments.length > 0
      end
      render json: user_hash_to_json
  end

  def edit
    @user = User.find(session[:user_id])
  end

  def update
    @current_user = User.find_by_id(session[:user_id])
    if @user = User.find(params[:id])
      @id = @user.id.to_s
      @user.update_attributes(user_update_params)
      flash[:notice] = "Your profile has been successfully updated"
      # redirect_to(:action => 'show', :id => @user.id)
      render json: {message: "user updated"}
    else
      render json: {message: "update error"}, status: :forbidden
    end

  end

  def destroy
    user = User.find(params[:id])
    user.destroy
    redirect_to '/users'
  end


  private

  def user_signup_params
    params.permit(:email, :password, :password_confirm)
  end

  def user_update_params
    params.require(:user).permit(:username, :given_name, :family_name, :email, :address, :phone_number, :profession, :description, :image)
  end

end
